const initialState = {
    theme: true, //true = dark , false = light THEME
    login: false,
    id: '', // Employee id
    name: '',
    division: '',
    version: '0',
    module: '',
    filters: [
        { name: 'plan', label: 'Prod Plan (Plan * BOM)', index: 1, disabled: true, checked: true, bgColor: 'bg-yellow-500' },
        { name: 'pickList', label: 'PickList', index: 2, disabled: false, checked: false, bgColor: 'bg-red-500' },
        // { name: 'produse', label: 'Prod.Use', index: 3, disabled: false, checked: false, bgColor: 'bg-orange-500' },
        { name: 'do', label: 'D/O Plan', index: 4, disabled: true, checked: true, bgColor: 'bg-green-500' },
        { name: 'doAct', label: 'D/O Act.', index: 5, disabled: false, checked: true, bgColor: 'bg-teal-400' },
        { name: 'stock', label: 'P/S Stock Simulate', index: 6, disabled: true, checked: true, bgColor: 'bg-blue-600' },
        { name: 'wip', label: 'WIP', index: 7, disabled: true, checked: false, bgColor: 'bg-gray-400' },
        { name: 'po', label: 'PO', index: 8, disabled: false, checked: false, bgColor: 'bg-teal-500' },
        { name: 'pofifo', label: 'PO FIFO', index: 9, disabled: true, checked: true, bgColor: 'bg-teal-500' },
        { name: 'box', label: 'BOX', index: 10, disabled: false, checked: false, bgColor: 'bg-teal-500' },
        // { name: 'pallet', label: 'PALLET', index: 11, disabled: false, checked: false, bgColor: 'bg-teal-500' },

        

    ],
    menuLeft: [{
        path: '/do', text: 'D/O PLAN', value: 'd/o'
    }, {
        path: '/supplier', text: 'SUPPLIER', value: 'supplier'
    }, {
        path: '/stock', text: 'STOCK', value: 'stock'
    }, {
        path: '/po', text: 'PO', value: 'po'
    }, {
        path: '/master', text: 'MASTER', value: 'master'
    }, {
        path: '/calendar', text: 'MASTER', value: 'master'
    }],
    privilegeFilter: {
        employee: ['plan','pickList', 'do', 'stock', 'pofifo','box'],
        supplier: ['do', 'doact', ,'box','delivery_management']
    },
    dayOfWeek: [
        "Sun",
        "Mon",
        "Tue",
        "Wed",
        "Thu",
        "Fri",
        "Sat"
    ],
    vender: [],
    menuIndex: 0,
    plan: {},
    master: {
        filter: {
            vender: ''
        }
    },
    filter: {
        plan: {
            caldowhenstockminus: false
        },
        master: {
            vender: ''
        },
        supplier: {
            vender: ''
        }
    },
    jwt: '',
    navPrivilege: [],
    typeAccount: 'employee',
    partMaster: [],
    venderMaster: [],
    privilege: [],
    dvcd: '',
    activeMenu: '',
    hiddenNoPlan: true ,
    supplier:''
}

const IndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_HIDDEN_PART_NO_PLAN':
            return {
                ...state,
                hiddenNoPlan: action.payload
            }
        case 'SET_ACTIVE_MENU':
            return {
                ...state,
                activeMenu: action.payload
            }
        case 'SET_PRIVILEGE':
            return {
                ...state,
                privilege: action.payload
            }
        case 'SET_PART_MASTER':
            return {
                ...state,
                partMaster: action.payload
            }
        case 'SET_VENDER_MASTER':
            return {
                ...state,
                venderMaster: action.payload
            }
        case 'INIT_LOGIN':
            var filters = state.filters;
            filters.map((title, index) => {
                if (title.disabled == false) {
                    filters[index]['checked'] = false;
                }
                if (state.privilegeFilter[state.typeAccount].includes(title.name)) {
                    filters[index]['checked'] = true;
                } else {
                    filters[index]['checked'] = false;
                }
            })
            action.payload.filters = filters;
            return {
                ...state,
                ...action.payload
            }
        case 'TYPE_ACCOUNT':
            if (action.payload == 'employee') {
                var index = state.filters.findIndex((item) => item.name == 'plan');
                state.filters[index].checked = true;
                index = state.filters.findIndex((item) => item.name == 'stock');
                state.filters[index].checked = true;

            } else {
                var index = state.filters.findIndex((item) => item.name == 'plan');
                state.filters[index].checked = false;
                index = state.filters.findIndex((item) => item.name == 'stock');
                state.filters[index].checked = false;

                
            }
            return {
                ...state,
                typeAccount: action.payload
            }
        case 'PRIVILEGE_SET':
            return {
                ...state,
                navPrivilege: action.payload
            }
        case 'RESET':
            var resetState = initialState
            console.log(resetState)
            resetState.version = action.payload.version;
            resetState.login = false;
            resetState.privilege = [];
            var filters = state.filters;
            filters.map((title, index) => {
                if (title.disabled == false) {
                    filters[index]['checked'] = false;
                }
                if (state.privilegeFilter[state.typeAccount].includes(title.name)) {
                    filters[index]['checked'] = true;
                } else {
                    filters[index]['checked'] = false;
                }
            });
            action.payload.filters = filters;
            return resetState;
        case 'INIT_PLAN':
            var index = 0;
            action.payload.forEach(element => {
                element.index = index;
                element.edit = false;
                index++;
            });
            return {
                ...state,
                plan: action.payload
            }
        case 'UPDATE_PLAN_EDIT':
            console.log(action)
            return {
                ...state,
                // plan: [...state.plan, ...action.payload]
            }
        case 'SET_VENDER':
            return {
                ...state,
                vender: action.payload
            }
        case 'NAV_MENU_SELECT':
            return {
                ...state,
                menuIndex: action.payload
            }
        case 'CLEAR_LOGIN':
            return {
                ...state,
                login: false,
                id: ''
            }
        case 'INIT_DIV':
            return {
                ...state,
                division: action.payload.division,
                module: ''
            }
        case 'INIT_MODULE':
            return {
                ...state,
                ...action.payload
            }
        case 'CLEAR_MENU':
            return {
                ...state,
                division: '',
                module: ''
            }
        case 'UPDATE_FILTER':
            var index = state.filters.findIndex((item) => item.name == action.name);
            state.filters[index].checked = action.checked;
            return {
                ...state
            }
        case 'MASTER_SET_FILTER':
            var filter = state.filter;
            filter.master = { ...filter.master, ...action.payload }
            return { ...state, filter: state.filter }
        case 'PLAN_SET_FILTER':
            var filter = state.filter;
            filter.plan.caldowhenstockminus = action.payload;
            return {
                ...state,
                filter: filter
            }
        case 'SUPPLIER_PAGE_SET_FILTER':
            var filter = state.filter;
            filter.supplier.vender = action.payload;
            return {
                ...state,
                filter: filter
            }
        case 'JWT':
            return {
                ...state,
                jwt: action.payload
            }
        case 'SET_SUPPLIER':
            return {
                ...state,
                supplier: action.payload
            }
        default:
            return state
    }
}
export default IndexReducer;
