/**
 * Created by szhitenev on 04.05.2016.
 */
(function () {

    "use strict";

    var getMenu = function () {
        return window.fetch("portal/content/json/menu.json").then(function (data) {
            return data.json();
        });
    };

    var getBaseAttrs = function () {
        return [
            {
                "key": "name",
                "name": "Name",
                "value_type": 10
            },
            {
                "key": "short_name",
                "name": "Short name",
                "value_type": 10
            },
            {
                "key": "notes",
                "name": "Notes",
                "value_type": 10
            }
        ];
    };


    // DEPRECATED start look at metaRestrictionRepository

    var getEntitiesWithoutBaseAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction',
            'complex-transaction', 'transaction-report', 'cash-flow-projection-report', 'performance-report',
            'balance-report', 'pnl-report', 'audit-transaction', 'audit-instrument'];
    };

    // DEPRECATED end look at metaRestrictionRepository

    var getEntitiesWithoutDynAttrsList = function () {
        return ['price-history', 'currency-history', 'transaction', 'pricing-policy', 'strategy-1', 'strategy-2', 'strategy-3',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup',
            'audit-transaction', 'audit-instrument'];
    };

    var getEntityAttrs = function (entity) {
        var entityAttrs = {
            "portfolio": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "accounts",
                    "name": "Accounts",
                    "value_type": "mc_field"

                },
                {
                    "key": "responsibles",
                    "name": "Responsibles",
                    "value_type": "mc_field"
                },
                {
                    "key": "counterparties",
                    "name": "Counterparties",
                    "value_type": "mc_field"
                },
                {
                    "key": "transaction_types",
                    "name": "Transaction types",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "audit-transaction": [
                {
                    "key": "date_formatted",
                    "name": "Date",
                    "value_type": 10
                },
                {
                    "key": "username",
                    "name": "Member",
                    "value_type": 10
                },
                {
                    "key": "field_name",
                    "name": "Field",
                    "value_type": 10
                },
                {
                    "key": "old_value",
                    "name": "Old value",
                    "value_type": 10
                },
                {
                    "key": "value",
                    "name": "New value",
                    "value_type": 10
                },
                {
                    "key": "message",
                    "name": "Message",
                    "value_type": 10
                }
            ],
            "audit-instrument": [
                {
                    "key": "date_formatted",
                    "name": "Date",
                    "value_type": 10
                },
                {
                    "key": "username",
                    "name": "Member",
                    "value_type": 10
                },
                {
                    "key": "field_name",
                    "name": "Field",
                    "value_type": 10
                },
                {
                    "key": "old_value",
                    "name": "Old value",
                    "value_type": 10
                },
                {
                    "key": "value",
                    "name": "New value",
                    "value_type": 10
                },
                {
                    "key": "message",
                    "name": "Message",
                    "value_type": 10
                }
            ],
            "account": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"

                },
                {
                    "key": "type",
                    "name": "Type",
                    "value_type": "field"
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "tag": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "content_types",
                    "name": "Content Types",
                    "value_type": 'mc_field'
                }
            ],
            "account-type": [
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "show_transaction_details",
                    "name": "Show transaction details",
                    "value_type": "boolean"
                },
                {
                    "key": "transaction_details_expr",
                    "name": "Transaction details expr",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "counterparty": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "counterparty-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "responsible": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "responsible-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "pricing-policy": [
                {
                    "key": "expr",
                    "name": "Expression",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                }
            ],
            "instrument-type": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "is_active",
                    "name": "Is active",
                    "value_type": "boolean"
                },
                {
                    "key": "instrument_class",
                    "name": "Instrument class",
                    "value_type": "field"
                },
                {
                    "key": "one_off_event",
                    "name": "One off event",
                    "value_type": "field"
                },
                {
                    "key": "regular_event",
                    "name": "Regular event",
                    "value_type": "field"
                },
                {
                    "key": "factor_same",
                    "name": "Factor same",
                    "value_type": "field"
                },
                {
                    "key": "factor_up",
                    "name": "Factor up",
                    "value_type": "field"
                },
                {
                    "key": "factor_down",
                    "name": "Factor down",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "instrument": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "instrument_type",
                    "name": "Instrument type",
                    "value_type": "field"
                },
                {
                    "key": "is_active",
                    "name": "Is active",
                    "value_type": "boolean"
                },
                {
                    "key": "reference_for_pricing",
                    "name": "Reference for pricing",
                    "value_type": 10
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": "field"
                },
                {
                    "key": "pricing_currency",
                    "name": "Pricing currency",
                    "value_type": "field"
                },
                {
                    "key": "price_multiplier",
                    "name": "Price multiplier",
                    "value_type": "float"
                },
                {
                    "key": "accrued_currency",
                    "name": "Accrued currency",
                    "value_type": "field"
                },
                {
                    "key": "maturity_date",
                    "name": "Maturity date",
                    "value_type": 40
                },
                {
                    "key": "accrued_multiplier",
                    "name": "Accrued multiplier",
                    "value_type": "float"
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": "field"
                },
                {
                    "key": "payment_size_detail",
                    "name": "Payment size detail",
                    "value_type": "field"
                },
                {
                    "key": "default_price",
                    "name": "Default price",
                    "value_type": "float"
                },
                {
                    "key": "default_accrued",
                    "name": "Default accrued",
                    "value_type": "float"
                },
                {
                    "key": "user_text_1",
                    "name": "User text 1",
                    "value_type": 10
                },
                {
                    "key": "user_text_2",
                    "name": "User text 2",
                    "value_type": 10
                },
                {
                    "key": "user_text_3",
                    "name": "User text 3",
                    "value_type": 10
                },
                {
                    "key": "object_permissions_user",
                    "name": "Users permissions",
                    "value_type": "mc_field"
                },
                {
                    "key": "object_permissions_group",
                    "name": "Groups permissions",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "transaction": [
                {
                    "key": "transaction_code",
                    "name": "Transaction Code",
                    "value_type": 20
                },
                {
                    "key": "transaction_class",
                    "name": "Transaction class",
                    "value_type": "field"
                },
                {
                    "key": "portfolio",
                    "name": "Portfolio",
                    "value_type": "field"
                },
                {
                    "key": "transaction_currency",
                    "name": "Transaction currency",
                    "value_type": "field"
                },
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "position_size_with_sign",
                    "name": "Position Size with sign",
                    "value_type": "float"
                },
                {
                    "key": "settlement_currency",
                    "name": "Settlement currency",
                    "value_type": "field"
                },
                {
                    "key": "cash_consideration",
                    "name": "Cash consideration",
                    "value_type": "float"
                },
                {
                    "key": "principal_with_sign",
                    "name": "Principal with sign",
                    "value_type": "float"
                },
                {
                    "key": "carry_with_sign",
                    "name": "Carry with sign",
                    "value_type": "float"
                },
                {
                    "key": "overheads_with_sign",
                    "name": "Overheads with sign",
                    "value_type": "float"
                },
                {
                    "key": "accounting_date",
                    "name": "Accounting date",
                    "value_type": 40
                },
                {
                    "key": "cash_date",
                    "name": "Cash date",
                    "value_type": 40
                },
                //{
                //    "key": "transaction_date",
                //    "name": "Transaction date",
                //    "value_type": 40
                //},
                {
                    "key": "account_cash",
                    "name": "Account cash",
                    "value_type": 'field'
                },
                {
                    "key": "account_position",
                    "name": "Account position",
                    "value_type": 'field'
                },
                {
                    "key": "account_interim",
                    "name": "Account interim",
                    "value_type": 'field'
                },
                {
                    "key": "strategy1_position",
                    "name": "Strategy1 position",
                    "value_type": 'field'
                },
                {
                    "key": "strategy1_cash",
                    "name": "Strategy1 cash",
                    "value_type": 'field'
                },
                {
                    "key": "strategy2_position",
                    "name": "Strategy2 position",
                    "value_type": 'field'
                },
                {
                    "key": "strategy2_cash",
                    "name": "Strategy2 cash",
                    "value_type": 'field'
                },
                {
                    "key": "strategy3_position",
                    "name": "Strategy3 position",
                    "value_type": 'field'
                },
                {
                    "key": "strategy3_cash",
                    "name": "Strategy3 cash",
                    "value_type": 'field'
                },
                {
                    "key": "reference_fx_rate",
                    "name": "Reference fx rate",
                    "value_type": 'float'
                },
                {
                    "key": "is_locked",
                    "name": "Is locked",
                    "value_type": 'boolean'
                },
                {
                    "key": "is_canceled",
                    "name": "Is canceled",
                    "value_type": 'boolean'
                },
                {
                    "key": "factor",
                    "name": "Factor",
                    "value_type": 'float'
                },
                {
                    "key": "principal_amount",
                    "name": "Principal amount",
                    "value_type": 'float'
                },
                {
                    "key": "carry_amount",
                    "name": "Carry amount",
                    "value_type": 'float'
                },
                {
                    "key": "overheads",
                    "name": "overheads",
                    "value_type": 'float'
                },
                {
                    "key": "responsible",
                    "name": "Responsible",
                    "value_type": 'field'
                },
                {
                    "key": "counterparty",
                    "name": "Counterparty",
                    "value_type": 'field'
                }
            ],
            "transaction-type-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "transaction-type": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "display_expr",
                    "name": "Display Expression",
                    "value_type": 10
                },
                {
                    "key": "instrument_types",
                    "name": "Instrument types",
                    "value_type": "mc_field"
                },
                {
                    "key": "portfolios",
                    "name": "Portfolios",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "currency": [
                {
                    "key": "reference_for_pricing",
                    "name": "Reference for pricing",
                    "value_type": 10
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": "field"
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "currency-history": [
                {
                    "key": "currency",
                    "name": "Currency",
                    "value_type": "field"
                },
                {
                    "key": "date",
                    "name": "Date",
                    "value_type": 40
                },
                {
                    "key": "fx_rate",
                    "name": "Fx rate",
                    "value_type": "float"
                },
                {
                    "key": "pricing_policy",
                    "name": "Pricing policy",
                    "value_type": "field"
                }
                //{
                //    "key": "fx_rate_expr",
                //    "name": "fx_rate_expr",
                //    "value_type": 10
                //}
            ],
            "price-history": [
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "date",
                    "name": "Date",
                    "value_type": 40
                },
                {
                    "key": "pricing_policy",
                    "name": "Pricing policy",
                    "value_type": "field"
                },
                {
                    "key": "principal_price",
                    "name": "Principal price",
                    "value_type": "float"
                },
                {
                    "key": "accrued_price",
                    "name": "Accrued price",
                    "value_type": "float"
                }
                //{
                //    "key": "factor",
                //    "name": "Factor",
                //    "value_type": "float"
                //}
            ],
            "strategy-1": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-2": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-3": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "subgroup",
                    "name": "Sub Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-1-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-2-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-3-subgroup": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "group",
                    "name": "Group",
                    "value_type": "field"
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-1-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-2-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "strategy-3-group": [
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "tags",
                    "name": "Tags",
                    "value_type": "mc_field"
                }
            ],
            "balance-report": [
                //{
                //    "key": "name",
                //    "name": "Name",
                //    "value_type": 10
                //},
                //{
                //    "key": "short_name",
                //    "name": "Short name",
                //    "value_type": 10
                //},
                //{
                //    "key": "user_code",
                //    "name": "User code",
                //    "value_type": 10
                //},
                //{
                //    "key": "last_notes",
                //    "name": "Last notes",
                //    "value_type": 10
                //},
                //{
                //    "key": "account",
                //    "name": "Account",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument",
                //    "name": "Instrument",
                //    "value_type": "field"
                //},
                //{
                //    "key": "currency",
                //    "name": "Currency",
                //    "value_type": "field"
                //},
                //{
                //    "key": "portfolio",
                //    "name": "Portfolio",
                //    "value_type": "field"
                //},
                //{
                //    "key": "strategy-1",
                //    "name": "Strategy 1",
                //    "value_type": "field"
                //},
                //{
                //    "key": "strategy-2",
                //    "name": "Strategy 2",
                //    "value_type": "field"
                //},
                //{
                //    "key": "strategy-3",
                //    "name": "Strategy 3",
                //    "value_type": "field"
                //},
                {
                    "key": "position_size",
                    "name": "Position size",
                    "value_type": "float"
                },
                {
                    "key": "pricing_currency",
                    "name": "Pricing",
                    "value_type": "float"
                },
                {
                    "key": "instrument_principal",
                    "name": "Current Price",
                    "value_type": "float"
                },
                {
                    "key": "instrument_accrued",
                    "name": "Current Accrued",
                    "value_type": "float"
                },
                {
                    "key": "instrument_pricing_currency_fx_rate",
                    "name": "Pricing currency fx rate",
                    "value_type": "float"
                },
                {
                    "key": "instrument_accrued_currency_fx_rate",
                    "name": "Accrued currency FX rate",
                    "value_type": "float"
                },

                {
                    "key": "instrument_accrual_object_accrual_size",
                    "name": "Current Payment Size",
                    "value_type": "float"
                },
                {
                    "key": "instrument_accrual_object_periodicity_object_name",
                    "name": "Current Payment Frequency",
                    "value_type": "float"
                },
                {
                    "key": "instrument_accrual_object_periodicity_n",
                    "name": "Current Payment Periodicity N",
                    "value_type": "float"
                },


                //{
                //    "key": "report_currency_fx_rate",
                //    "name": "Report currency fx rate",
                //    "value_type": "float"
                //},
                //{
                //    "key": "instrument_price_history_principal_price",
                //    "name": "Instrument price history principal price",
                //    "value_type": "float"
                //},
                //{
                //    "key": "instrument_price_history_accrued_price",
                //    "name": "Instrument price history accrued price",
                //    "value_type": "float"
                //},
                //{
                //    "key": "instrument_pricing_currency_fx_rate",
                //    "name": "Instrument pricing currency fx rate",
                //    "value_type": "float"
                //},
                //{
                //    "key": "instrument_accrued_currency_fx_rate",
                //    "name": "Instrument accrued currency fx rate",
                //    "value_type": "float"
                //},
                //{
                //    "key": "currency_fx_rate",
                //    "name": "Currency fx rate",
                //    "value_type": "float"
                //},


                {
                    "key": "date",
                    "name": "Date",
                    "value_type": 40
                },
                {
                    "key": "ytm",
                    "name": "YTM",
                    "value_type": "float"
                },
                {
                    "key": "modified_duration",
                    "name": "Modified duration",
                    "value_type": "float"
                },

                {
                    "key": "last_notes",
                    "name": "Last notes",
                    "value_type": 10
                },
                //{
                //    "key": "gross_cost_price",
                //    "name": "Gross cost price",
                //    "value_type": "float"
                //},
                {
                    "key": "gross_cost_price_loc",
                    "name": "Gross cost price (LOC)",
                    "value_type": "float"
                },
                {
                    "key": "ytm_at_cost",
                    "name": "YTM at cost",
                    "value_type": "float"
                },
                {
                    "key": "time_invested",
                    "name": "Time invested",
                    "value_type": "float"
                },
                //{
                //    "key": "net_cost_price",
                //    "name": "Net cost price",
                //    "value_type": "float"
                //},
                {
                    "key": "net_cost_price_loc",
                    "name": "Net cost price (LOC)",
                    "value_type": "float"
                },
                //{
                //    "key": "report_currency_history",
                //    "name": "Report currency history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument_price_history",
                //    "name": "Instrument price history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument_pricing_currency_history",
                //    "name": "Instrument pricing currency history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument_accrued_currency_history",
                //    "name": "Instrument accrued currency history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "currency_history",
                //    "name": "Currency history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "pricing_currency_history",
                //    "name": "Pricing currency history",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument_accrual",
                //    "name": "Instrument accrual",
                //    "value_type": "field"
                //},
                //{
                //    "key": "instrument_accrual_accrued_price",
                //    "name": "Instrument accrual accrued price",
                //    "value_type": "field"
                //},

                {
                    "key": "principal_invested",
                    "name": "Principal invested",
                    "value_type": "float"
                },
                {
                    "key": "principal_invested_loc",
                    "name": "Principal invested (LOC)",
                    "value_type": "float"
                },
                {
                    "key": "amount_invested",
                    "name": "Amount invested",
                    "value_type": "float"
                },
                {
                    "key": "amount_invested_loc",
                    "name": "Amount invested (LOC)",
                    "value_type": "float"
                },

                {
                    "key": "market_value",
                    "name": "Market value",
                    "value_type": "float"
                },
                {
                    "key": "market_value_loc",
                    "name": "Market value (LOC)",
                    "value_type": "float"
                },
                {
                    "key": "market_value_percent",
                    "name": "Market value %",
                    "value_type": "float"
                },
                {
                    "key": "exposure",
                    "name": "Exposure",
                    "value_type": "float"
                },
                {
                    "key": "exposure_percent",
                    "name": "Exposure %",
                    "value_type": "float"
                },
                {
                    "key": "exposure_loc",
                    "name": "Exposure (LOC)",
                    "value_type": "float"
                }
            ],
            'report-addon-performance': [
                {
                    "key": "instrument_principal",
                    "name": "Opened Principal",
                    "value_type": "float"
                },
                {
                    "key": "instrument_accrued",
                    "name": "Opened Carry",
                    "value_type": "float"
                },
                {
                    "key": "net_position_return",
                    "name": "Net position return",
                    "value_type": "float"
                },
                {
                    "key": "net_position_return_loc",
                    "name": "Net position return (LOC)",
                    "value_type": "float"
                },
                {
                    "key": "position_return",
                    "name": "Position return",
                    "value_type": "float"
                },
                {
                    "key": "position_return_loc",
                    "name": "Position return (LOC)",
                    "value_type": "float"
                },
                {
                    "key": "daily_price_change",
                    "name": "Daily price change",
                    "value_type": "float"
                },
                {
                    "key": "mtd_price_change",
                    "name": "MTD price change",
                    "value_type": "float"
                },

            ],
            "pnl-report": [
                {
                    "key": "name",
                    "name": "Name",
                    "value_type": 10
                },
                {
                    "key": "short_name",
                    "name": "Short Name",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "account",
                    "name": "Account",
                    "value_type": "field"
                },
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "currency",
                    "name": "Currency",
                    "value_type": "field"
                },
                {
                    "key": "portfolio",
                    "name": "Portfolio",
                    "value_type": "field"
                },
                {
                    "key": "strategy-1",
                    "name": "Strategy 1",
                    "value_type": "field"
                },
                {
                    "key": "strategy-2",
                    "name": "Strategy 2",
                    "value_type": "field"
                },
                {
                    "key": "strategy-3",
                    "name": "Strategy 3",
                    "value_type": "field"
                },
                {
                    "key": "carry",
                    "name": "Carry",
                    "value_type": "float"
                },
                {
                    "key": "carry_closed",
                    "name": "Carry closed",
                    "value_type": "float"
                },
                {
                    "key": "carry_fixed",
                    "name": "Carry fixed",
                    "value_type": "float"
                },
                {
                    "key": "carry_fixed_closed",
                    "name": "Carry fixed closed",
                    "value_type": "float"
                },
                {
                    "key": "carry_fixed_opened",
                    "name": "Carry fixed opened",
                    "value_type": "float"
                },
                {
                    "key": "carry_fx",
                    "name": "Carry FX",
                    "value_type": "float"
                },
                {
                    "key": "carry_fx_closed",
                    "name": "Carry FX closed",
                    "value_type": "float"
                },
                {
                    "key": "carry_fx_opened",
                    "name": "Carry FX opened",
                    "value_type": "float"
                },
                {
                    "key": "carry_opened",
                    "name": "Carry opened",
                    "value_type": "float"
                },
                {
                    "key": "overheads",
                    "name": "Overheads",
                    "value_type": "float"
                },
                {
                    "key": "overheads_closed",
                    "name": "Overheads closed",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fixed",
                    "name": "Overheads fixed",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fixed_closed",
                    "name": "Overheads fixed closed",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fixed_opened",
                    "name": "Overheads fixed opened",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fx",
                    "name": "Overheads FX",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fx_closed",
                    "name": "Overheads FX closed",
                    "value_type": "float"
                },
                {
                    "key": "overheads_fx_opened",
                    "name": "Overheads FX opened",
                    "value_type": "float"
                },
                {
                    "key": "overheads_opened",
                    "name": "Overheads opened",
                    "value_type": "float"
                },
                {
                    "key": "principal",
                    "name": "Principal",
                    "value_type": "float"
                },
                {
                    "key": "principal_closed",
                    "name": "Principal closed",
                    "value_type": "float"
                },
                {
                    "key": "principal_fixed",
                    "name": "Principal fixed",
                    "value_type": "float"
                },
                {
                    "key": "principal_fixed_closed",
                    "name": "Principal fixed closed",
                    "value_type": "float"
                },
                {
                    "key": "principal_fixed_opened",
                    "name": "Principal fixed opened",
                    "value_type": "float"
                },
                {
                    "key": "principal_fx",
                    "name": "Principal FX",
                    "value_type": "float"
                },
                {
                    "key": "principal_fx_closed",
                    "name": "Principal FX closed",
                    "value_type": "float"
                },
                {
                    "key": "principal_fx_opened",
                    "name": "Principal FX opened",
                    "value_type": "float"
                },
                {
                    "key": "principal_opened",
                    "name": "Principal opened",
                    "value_type": "float"
                },
                {
                    "key": "total",
                    "name": "Total",
                    "value_type": "float"
                },
                {
                    "key": "total_closed",
                    "name": "Total closed",
                    "value_type": "float"
                },
                {
                    "key": "total_fixed",
                    "name": "Total fixed",
                    "value_type": "float"
                },
                {
                    "key": "total_fixed_closed",
                    "name": "Total fixed closed",
                    "value_type": "float"
                },
                {
                    "key": "total_fixed_opened",
                    "name": "Total fixed opened",
                    "value_type": "float"
                },
                {
                    "key": "total_fx",
                    "name": "Total FX",
                    "value_type": "float"
                },
                {
                    "key": "total_fx_closed",
                    "name": "Total FX closed",
                    "value_type": "float"
                },
                {
                    "key": "total_fx_opened",
                    "name": "Total FX opened",
                    "value_type": "float"
                },
                {
                    "key": "total_opened",
                    "name": "Total opened",
                    "value_type": "float"
                },
                {
                    "key": "total_real",
                    "name": "Total real",
                    "value_type": "float"
                },
                {
                    "key": "total_unreal",
                    "name": "Total unreal",
                    "value_type": "float"
                },
                {
                    "key": "market_value",
                    "name": "Market value",
                    "value_type": "float"
                },
                {
                    "key": "exposure",
                    "name": "Exposure",
                    "value_type": "float"
                },
                {
                    "key": "market_value_percent",
                    "name": "Market value %",
                    "value_type": "float"
                },
                {
                    "key": "exposure_percent",
                    "name": "Exposure %",
                    "value_type": "float"
                }
            ],
            "transaction-report": [
                {
                    "key": "account_cash",
                    "name": "Account cash",
                    "value_type": "field"
                },
                {
                    "key": "account_interim",
                    "name": "Account interim",
                    "value_type": "field"
                },
                {
                    "key": "account_position",
                    "name": "Account position",
                    "value_type": "field"
                },
                {
                    "key": "account_date",
                    "name": "Account date",
                    "value_type": 40
                },
                {
                    "key": "allocation_balance",
                    "name": "Allocation balance", // link to instrument
                    "value_type": "field"
                },
                {
                    "key": "allocation_pl",
                    "name": "Allocation pl", // link to instrument
                    "value_type": "field"
                },
                {
                    "key": "carry_with_sign",
                    "name": "Carry with sign",
                    "value_type": "float"
                },
                {
                    "key": "cash_consideration",
                    "name": "Cash consideration",
                    "value_type": "float"
                },
                {
                    "key": "cash_date",
                    "name": "Cash date",
                    "value_type": 40
                },
                {
                    "key": "complex-transaction",
                    "name": "Complex transaction",
                    "value_type": "field"
                },
                {
                    "key": "counterparty",
                    "name": "Counterparty",
                    "value_type": "field"
                },
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "linked_instrument",
                    "name": "Linked Instrument",
                    "value_type": "field"
                },
                {
                    "key": "overheads_with_sign",
                    "name": "Overheads with sign",
                    "value_type": "float"
                },
                {
                    "key": "portfolio",
                    "name": "Portfolio",
                    "value_type": "field"
                },
                {
                    "key": "principal_with_sign",
                    "name": "Principal with sign",
                    "value_type": "float"
                },
                {
                    "key": "reference_fx_rate",
                    "name": "Reference fx rate",
                    "value_type": "float"
                },
                {
                    "key": "responsible",
                    "name": "Responsible",
                    "value_type": "field"
                },
                {
                    "key": "settlement_currency",
                    "name": "Settlement currency",
                    "value_type": "field"
                },
                {
                    "key": "strategy1_cash",
                    "name": "Strategy 1 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy1_position",
                    "name": "Strategy 1 position",
                    "value_type": "field"
                },
                {
                    "key": "strategy2_cash",
                    "name": "Strategy 2 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy2_position",
                    "name": "Strategy 2 position",
                    "value_type": "field"
                },
                {
                    "key": "strategy3_cash",
                    "name": "Strategy 3 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy3_position",
                    "name": "Strategy 3 position",
                    "value_type": "field"
                },
                {
                    "key": "transaction_class",
                    "name": "Transaction class",
                    "value_type": "field"
                },
                {
                    "key": "transaction_code",
                    "name": "Transaction code",
                    "value_type": "float"
                },
                {
                    "key": "transaction_currency",
                    "name": "Transaction currency",
                    "value_type": "field"
                },
                {
                    "key": "transaction_date",
                    "name": "Transaction date",
                    "value_type": 40
                }
            ],
            "cash-flow-projection-report": [
                {
                    "key": "account_cash",
                    "name": "Account cash",
                    "value_type": "field"
                },
                {
                    "key": "account_interim",
                    "name": "Account interim",
                    "value_type": "field"
                },
                {
                    "key": "account_position",
                    "name": "Account position",
                    "value_type": "field"
                },
                {
                    "key": "allocation_balance",
                    "name": "Allocation balance", // link to instrument
                    "value_type": "field"
                },
                {
                    "key": "allocation_pl",
                    "name": "Allocation pl", // link to instrument
                    "value_type": "field"
                },
                {
                    "key": "carry_with_sign",
                    "name": "Carry with sign",
                    "value_type": "float"
                },
                {
                    "key": "cash_consideration",
                    "name": "Cash consideration",
                    "value_type": "float"
                },
                {
                    "key": "cash_consideration_after",
                    "name": "Cash consideration after",
                    "value_type": "float"
                },
                {
                    "key": "cash_consideration_before",
                    "name": "Cash consideration before",
                    "value_type": "float"
                },
                {
                    "key": "cash_date",
                    "name": "Cash date",
                    "value_type": 40
                },
                {
                    "key": "complex-transaction",
                    "name": "Complex transaction",
                    "value_type": "field"
                },
                {
                    "key": "counterparty",
                    "name": "Counterparty",
                    "value_type": "field"
                },
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "linked_instrument",
                    "name": "Linked Instrument",
                    "value_type": "field"
                },
                {
                    "key": "overheads_with_sign",
                    "name": "Overheads with sign",
                    "value_type": "float"
                },
                {
                    "key": "portfolio",
                    "name": "Portfolio",
                    "value_type": "field"
                },
                {
                    "key": "reference_fx_rate",
                    "name": "Reference fx rate",
                    "value_type": "float"
                },
                {
                    "key": "responsible",
                    "name": "Responsible",
                    "value_type": "field"
                },
                {
                    "key": "settlement_currency",
                    "name": "Settlement currency",
                    "value_type": "field"
                },
                {
                    "key": "strategy1_cash",
                    "name": "Strategy 1 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy1_position",
                    "name": "Strategy 1 position",
                    "value_type": "field"
                },
                {
                    "key": "strategy2_cash",
                    "name": "Strategy 2 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy2_position",
                    "name": "Strategy 2 position",
                    "value_type": "field"
                },
                {
                    "key": "strategy3_cash",
                    "name": "Strategy 3 cash",
                    "value_type": "field"
                },
                {
                    "key": "strategy3_position",
                    "name": "Strategy 3 position",
                    "value_type": "field"
                },
                {
                    "key": "transaction_class",
                    "name": "Transaction class",
                    "value_type": "field"
                },
                {
                    "key": "transaction_code",
                    "name": "Transaction code",
                    "value_type": "float"
                },
                {
                    "key": "transaction_currency",
                    "name": "Transaction currency",
                    "value_type": "field"
                },
                {
                    "key": "transaction_date",
                    "name": "Transaction date",
                    "value_type": 40
                }
            ],
            "performance-report": [
                {
                    "key": "name",
                    "name": "Name",
                    "value_type": 10
                },
                {
                    "key": "short_name",
                    "name": "Short name",
                    "value_type": 10
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "account",
                    "name": "Account",
                    "value_type": "field"
                },
                {
                    "key": "instrument",
                    "name": "Instrument",
                    "value_type": "field"
                },
                {
                    "key": "currency",
                    "name": "Currency",
                    "value_type": "field"
                },
                {
                    "key": "portfolio",
                    "name": "Portfolio",
                    "value_type": "field"
                },
                {
                    "key": "strategy-1",
                    "name": "Strategy 1",
                    "value_type": "field"
                },
                {
                    "key": "strategy-2",
                    "name": "Strategy 2",
                    "value_type": "field"
                },
                {
                    "key": "strategy-3",
                    "name": "Strategy 3",
                    "value_type": "field"
                },
                {
                    "key": "position_size",
                    "name": "Position size",
                    "value_type": "float"
                },
                {
                    "key": "market_value",
                    "name": "Market value",
                    "value_type": "float"
                },
                {
                    "key": "exposure",
                    "name": "Exposure",
                    "value_type": "float"
                },
                {
                    "key": "market_value_percent",
                    "name": "Market value %",
                    "value_type": "float"
                },
                {
                    "key": "exposure_percent",
                    "name": "Exposure %",
                    "value_type": "float"
                }
            ],
            "complex-transaction": [
                {
                    "key": "code",
                    "name": "Code",
                    "value_type": "float"
                },
                {
                    "key": "status",
                    "name": "Status",
                    "value_type": 10 // actually field
                },
                {
                    "key": "text",
                    "name": "Description",
                    "value_type": 10
                }
            ],
            "instrument-scheme": [
                {
                    key: 'reference_for_pricing',
                    name: 'Reference for pricing',
                    "value_type": 10
                },
                {
                    key: 'factor_schedule_method',
                    name: 'Factor schedule method',
                    type: 'field'
                },
                {
                    key: 'accrual_calculation_schedule_method',
                    name: 'Accrual calculation schedule method',
                    type: 'field'
                },
                {
                    "key": "user_code",
                    "name": "User code",
                    "value_type": 10
                },
                {
                    "key": "public_name",
                    "name": "Public name",
                    "value_type": 10
                },
                {
                    "key": "instrument_type",
                    "name": "Instrument type",
                    "value_type": 10
                },
                {
                    "key": "pricing_currency",
                    "name": "Pricing currency",
                    "value_type": 10
                },
                {
                    "key": "price_multiplier",
                    "name": "Price multiplier",
                    "value_type": 10
                },
                {
                    "key": "accrued_currency",
                    "name": "Accrued currency",
                    "value_type": 10
                },
                {
                    "key": "accrued_multiplier",
                    "name": "Accrued multiplier",
                    "value_type": 10
                },
                {
                    "key": "user_text_1",
                    "name": "User text 1",
                    "value_type": 10
                },
                {
                    "key": "user_text_2",
                    "name": "User text 2",
                    "value_type": 10
                },
                {
                    "key": "user_text_3",
                    "name": "User text 3",
                    "value_type": 10
                },
                {
                    "key": "maturity_date",
                    "name": "Maturity date",
                    "value_type": 10
                },
                {
                    "key": "payment_size_detail",
                    "name": "Payment size detail",
                    "value_type": 'field'
                },
                {
                    "key": "daily_pricing_model",
                    "name": "Daily pricing model",
                    "value_type": 'field'
                },
                {
                    "key": "price_download_scheme",
                    "name": "Price download scheme",
                    "value_type": 'field'
                },
                {
                    "key": "default_price",
                    "name": "Default price",
                    "value_type": 10
                },
                {
                    "key": "default_accrued",
                    "name": "Default accrued",
                    "value_type": 10
                }
            ]
        };

        return entityAttrs[entity];
    };

    var getValueTypes = function () {
        return [{
            "value": 20,
            "display_name": "Number"
        }, {
            "value": 10,
            "display_name": "String"
        }, {
            "value": 40,
            "display_name": "Date"
        }, {
            "value": 30,
            "display_name": "Classifier"
        }, {
            "value": "decoration",
            "display_name": "Decoration"
        }, {
            "value": "field",
            "display_name": "Field"
        }, {
            "value": "mc_field",
            "display_name": "Multiple choice field"
        }, {
            "value": "boolean",
            "display_name": "Boolean"
        }, {
            "value": "float",
            "display_name": "Float"
        }
        ];
    };

    var getDynamicAttrsValueTypes = function () {
        return [
            {
                "value": 20,
                "display_name": "Number"
            }, {
                "value": 10,
                "display_name": "String"
            }, {
                "value": 40,
                "display_name": "Date"
            }, {
                "value": 30,
                "display_name": "Classifier"
            }
        ]
    };

    var getRestrictedEntitiesWithTypeField = function () {
        return ['daily_pricing_model', 'payment_size_detail', 'accrued_currency', 'pricing_currency'];
    };

    var getEntityTabs = function (entityType) {
        switch (entityType) {
            case 'instrument':
                return [
                    {
                        label: 'Accruals',
                        templateUrl: 'views/tabs/instrument/accrual-calculation-schedules-view.html'
                    },
                    {
                        label: 'Events',
                        templateUrl: 'views/tabs/instrument/events-view.html'
                    },
                    {
                        label: 'Pricing',
                        templateUrl: 'views/tabs/instrument/manual-pricing-formulas-view.html'
                    },
                    {
                        label: 'Factors',
                        templateUrl: 'views/tabs/instrument/factor-schedule-view.html'
                    }
                ];
                break;
            case 'complex-transaction':
                return [
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/complex-transaction/book-transaction-actions-tab-view.html'
                    },
                    {
                        enabled: ['update'],
                        label: 'Transactions',
                        templateUrl: 'views/tabs/complex-transaction/book-transaction-transactions-tab-view.html'
                    }
                ];

                break;
            case 'transaction-type':
                return [
                    {
                        label: 'General',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-general-tab-view.html'
                    },
                    {
                        label: 'Inputs',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-inputs-tab-view.html'
                    },
                    {
                        label: 'Actions',
                        templateUrl: 'views/tabs/transaction-type/transaction-type-actions-tab-view.html'
                    }
                ];
                break;
        }
    };

    var getEntitiesWithSimpleFields = function () {
        // e.g. both of responsible-group, counterparty group
        // have save property group, so its hard to resolve proper service
        return ["responsible", 'counterparty',
            'strategy-1', 'strategy-2', 'strategy-3',
            'transaction-type', 'transaction-type-group',
            'strategy-1-group', 'strategy-2-group', 'strategy-3-group',
            'strategy-1-subgroup', 'strategy-2-subgroup', 'strategy-3-subgroup']
    };

    var getFieldsWithTagGrouping = function () {
        return ['instrument_type', 'type', 'transaction_type', 'instrument_types', 'transaction_types', 'account_types'];
    };

    module.exports = {
        getMenu: getMenu,
        getBaseAttrs: getBaseAttrs,
        getEntityAttrs: getEntityAttrs,
        getValueTypes: getValueTypes,
        getDynamicAttrsValueTypes: getDynamicAttrsValueTypes,
        getEntitiesWithoutDynAttrsList: getEntitiesWithoutDynAttrsList,
        getEntityTabs: getEntityTabs,
        getEntitiesWithoutBaseAttrsList: getEntitiesWithoutBaseAttrsList,
        getRestrictedEntitiesWithTypeField: getRestrictedEntitiesWithTypeField,
        getEntitiesWithSimpleFields: getEntitiesWithSimpleFields,
        getFieldsWithTagGrouping: getFieldsWithTagGrouping
    }


}());