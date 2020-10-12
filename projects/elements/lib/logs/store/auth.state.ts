import { CompanyService } from '../service/company.service';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import * as jwtDecode from 'jwt-decode';
import { tap, catchError } from 'rxjs/operators';
import { ClientSettingsService } from '../service/client-settings.service';


export interface AuthStateModel {
  isLoggedIn: boolean;
  token?: string;
  roles?: string[];
  permissions?: string[];
  country?: string;
  dateFormat?: string;
  timeZone?: string;
  timeFormat?: string;
}

export class AuthenticateUserAction {
  static readonly type = '[AuthState] AuthenticateUserAction';
  constructor(public payload: any) { }
}

export class SetUserPermissionsAction {
  static readonly type = '[AuthState] SetUserPermissionsAction';
  constructor(public permissions: string[]) { }
}

export class SetUserRolesAction {
  static readonly type = '[AuthState] SetUserRolesAction';
  constructor(public roles: string[]) { }
}

export class GetInstanceCountry {
  static readonly type = '[AuthState] GetInstanceCountry';
}

export class RequestDateFormat {
  static readonly type = '[AuthState] get date format from client settings';
}

@State<AuthStateModel>({
  name: 'AuthState',
  defaults: {
    isLoggedIn: false,
  }
})
export class AuthState {

  constructor(
    private clientSettingsService: ClientSettingsService,
    private companyService: CompanyService) { }

  @Selector()
  // tslint:disable-next-line: typedef
  static getAuthState(state: AuthStateModel) {
    return state;
  }

  @Selector()
  // tslint:disable-next-line: typedef
  static getCountry(state: AuthStateModel) {
    return state.country;
  }

  @Action(AuthenticateUserAction)
  // tslint:disable-next-line: typedef
  authenticateUserAction(
    ctx: StateContext<AuthStateModel>,
    action: AuthenticateUserAction,
  ) {
    const state = ctx.getState();
    ctx.setState({ ...state, isLoggedIn: true, token: action.payload.token });
    const roles: string[] = jwtDecode(action.payload.token).roles;
    ctx.dispatch(new SetUserRolesAction(roles));
  }

  @Action(SetUserRolesAction)
  // tslint:disable-next-line: typedef
  setUserRolesAction(
    ctx: StateContext<AuthStateModel>,
    action: SetUserRolesAction,
  ) {
    const state = ctx.getState();
    ctx.setState({ ...state, roles: action.roles });
  }

  @Action(SetUserPermissionsAction)
  // tslint:disable-next-line: typedef
  setUserPermissionsAction(
    ctx: StateContext<AuthStateModel>,
    action: SetUserPermissionsAction,
  ) {
    const state = ctx.getState();
    ctx.setState({ ...state, permissions: action.permissions });
  }

  @Action(GetInstanceCountry)
  // tslint:disable-next-line: typedef
  getInstanceCountry(
    ctx: StateContext<AuthStateModel>,
    action: GetInstanceCountry,
  ) {
    return this.companyService.getCompanyData().pipe(
      tap(res => {
        ctx.patchState({ country: res.main_companies[0].country });
      }),
      catchError(err => {
        throw err;
      })
    );
  }

  @Action(RequestDateFormat)
  // tslint:disable-next-line: typedef
  requestDateFormat(ctx: StateContext<AuthStateModel>) {
    return this.clientSettingsService.getAllClientSettings().pipe(
      tap(
        settings => {
          const instanceDateFormat = settings.date_format;
          this.clientSettingsService.getAllDateFormats().subscribe(
            res => {
              const allDateFormats = res.data;
              const index = allDateFormats.findIndex(item => item.key === instanceDateFormat);
              ctx.patchState({
                dateFormat: allDateFormats[index].val,
                timeZone: settings.timezone,
                timeFormat: settings.time_format
              });
            });
        }),
      catchError(
        err => {
          throw err;
        })
    );
  }

}
