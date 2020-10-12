export interface AllClientSettingsResponse {
    id: number;
    client_id: number;
    cybersource_payment_url: string;
    destination_id: any;
    timezone: string;
    time_format: string;
    offline_enabled: boolean;
    online_booking_enabled: boolean;
    payment_enabled: boolean;
    payment_method: string;
    payment_config: string;
    bank_name: string;
    language: string;
    cm_enabled: boolean;
    opentravel_enabled: boolean;
    fdm_enabled: boolean;
    pos_ssl_enabled: boolean;
    proxy_enabled: boolean;
    opera_enabled: boolean;
    call_accounting_enabled: boolean;
    proxy_printing_enabled: boolean;
    date_format: string;
    gdpr_compliant: boolean;
    fias_enabled: boolean;
    opentravel_settings: any;
}
