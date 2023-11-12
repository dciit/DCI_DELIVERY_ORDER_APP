const initialState = {
    theme: true, //true = dark , false = light THEME
    login: false,
    id: '', // Employee id
    name: '',
    division: '',
    version: '0',
    module: '',
    titles: [{ name: 'plan', label: 'Prod Plan (Plan * BOM)', index: 1, disabled: true, checked: true, bgColor: 'bg-yellow-500' },
    { name: 'picklist', label: 'Picklist', index: 2, disabled: false, checked: false, bgColor: 'bg-red-500' },
    { name: 'produse', label: 'Prod.Use', index: 3, disabled: false, checked: false, bgColor: 'bg-orange-500' },
    { name: 'doplan', label: 'D/O Plan', index: 4, disabled: true, checked: true, bgColor: 'bg-green-500' },
    { name: 'doact', label: 'D/O Act.', index: 5, disabled: false, checked: true, bgColor: 'bg-teal-400' },
    { name: 'stocksimulate', label: 'P/S Stock Simulate', index: 6, disabled: true, checked: true, bgColor: 'bg-blue-600' },
    { name: 'wip', label: 'WIP', index: 7, disabled: true, checked: false, bgColor: 'bg-gray-400' },
    { name: 'po', label: 'PO', index: 8, disabled: false, checked: false, bgColor: 'bg-teal-500' },
    { name: 'stock', label: 'P/S Stock', index: 9, disabled: false, checked: false, bgColor: 'bg-orange-500' },
    ],
    privilegeFilter: {
        employee: ['plan', 'doplan', 'stocksimulate'],
        supplier: ['doplan', 'doact']
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
    privilege: [],
    typeAccount: 'employee'
}

const IndexReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'TYPE_ACCOUNT':
            if (action.payload == 'employee') {
                var index = state.titles.findIndex((item) => item.name == 'plan');
                state.titles[index].checked = true;
                index = state.titles.findIndex((item) => item.name == 'stocksimulate');
                state.titles[index].checked = true;
            } else {
                var index = state.titles.findIndex((item) => item.name == 'plan');
                state.titles[index].checked = false;
                index = state.titles.findIndex((item) => item.name == 'stocksimulate');
                state.titles[index].checked = false;
            }
            return {
                ...state,
                typeAccount: action.payload
            }
        case 'PRIVILEGE_SET':
            return {
                ...state,
                privilege: action.payload
            }
        case 'RESET':
            var resetState = initialState
            resetState.version = action.payload.version;
            resetState.login = false;
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
        case 'INIT_LOGIN':
            var titles = state.titles;
            titles.map((title, index) => {
                if (title.disabled == false) {
                    titles[index]['checked'] = false;
                }
                if (state.privilegeFilter[state.typeAccount].includes(title.name)) {
                    titles[index]['checked'] = true;
                } else {
                    titles[index]['checked'] = false;
                }
            })
            action.payload.titles = titles;
            return {
                ...state,
                ...action.payload
            }
        case 'INIT_LOGOUT':
            var titles = state.titles;
            titles.map((title, index) => {
                if (title.disabled == false) {
                    titles[index]['checked'] = false;
                }
                if (state.privilegeFilter[state.typeAccount].includes(title.name)) {
                    titles[index]['checked'] = true;
                } else {
                    titles[index]['checked'] = false;
                }
            })
            action.payload.titles = titles;
            return {
                ...state,
                ...action.payload
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
        case 'CHECKED_FILTER':
            var index = state.titles.findIndex((item) => item.name == action.name);
            console.log(state.titles)
            state.titles[index].checked = action.checked;
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
            console.log(filter)
            return {
                ...state,
                filter: filter
            }
        case 'JWT':
            return {
                ...state,
                jwt: action.payload
            }
        default:
            return state
    }
}
export default IndexReducer;
