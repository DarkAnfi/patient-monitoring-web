import { Reducer } from 'redux';
import ui from 'redux/types/ui';

const isDarkActive: boolean = JSON.parse(localStorage.getItem('isDarkActive') ?? 'false');

const initialState: UIState = {
    isDarkActive,
    isMainMenuOpen: false,
    breadcrumbs: [],
    snackbars: [],
    infoModal: {
        isOpen: false,
        hideModalFooter: false,
        type: 'default' as const,
        buttonText: 'Ok',
        title: '',
        size: 'sm' as const,
        content: '',
        onOk: () => {},
    },
    confirmModal: {
        isOpen: false,
        type: 'default' as const,
        title: '',
        fullWidth: false,
        size: 'sm' as const,
        content: '',
        onConfirm: () => { },
        onCancel: () => { },
    },
    paddingEnable: true,
};

export const uiReducer: Reducer<UIState, SyncAction> = (state = initialState, action): UIState => {
    const { type, payload }: SyncAction = action;
    switch (type) {
        case ui.toggleDarkMode:
            return {
                ...state,
                isDarkActive: !state.isDarkActive,
            };
        case ui.toggleMainMenu:
            return {
                ...state,
                isMainMenuOpen: !state.isMainMenuOpen
            };
        case ui.openInfoModal:
            return {
                ...state,
                infoModal: {
                    ...state.infoModal,
                    isOpen: true,
                },
            };
        case ui.closeInfoModal:
            return {
                ...state,
                infoModal: {
                    ...state.infoModal,
                    isOpen: false,
                },
            };
        case ui.setInfoModalState:
            return {
                ...state,
                infoModal: {
                    ...state.infoModal,
                    ...payload,
                },
            };
        case ui.resetInfoModalState:
            return {
                ...state,
                infoModal: {
                    ...state.infoModal,
                    title: '', content: '', hideModalFooter: false,
                },
            };
        case ui.openConfirmModal:
            return {
                ...state,
                confirmModal: {
                    ...state.confirmModal,
                    isOpen: true,
                },
            };
        case ui.closeConfirmModal:
            return {
                ...state,
                confirmModal: {
                    ...state.confirmModal,
                    isOpen: false,
                },
            };
        case ui.setConfirmModalState:
            return {
                ...state,
                confirmModal: {
                    ...state.confirmModal,
                    ...payload,
                },
            };
        case ui.setConfirmModalTitle:
            return {
                ...state,
                confirmModal: {
                    ...state.confirmModal,
                    title:payload,
                },
            };
        case ui.setInfoModalTitle:
            return {
                ...state,
                infoModal: {
                    ...state.infoModal,
                    title:payload,
                },
            };
        case ui.resetConfirmModalState:
            return {
                ...state,
                confirmModal: {
                    ...state.confirmModal,
                    title: '', content: '', onConfirm: () => { },
                },
            };
        case ui.setBreadcrumbs:
            return {
                ...state,
                breadcrumbs: payload,
            };
        case ui.setPaddingEnable:
            return {
                ...state,
                paddingEnable: payload,
            };
        
        case ui.enqueueSnackbar:
            return {
                ...state,
                snackbars: [
                    ...state.snackbars,
                    payload,
                ],
            };

        case ui.closeSnackbar:
            return {
                ...state,
                snackbars: state.snackbars.map(snackbar => (
                    (payload.dismissAll || snackbar.key === payload.key)
                        ? { ...snackbar, dismissed: true }
                        : { ...snackbar }
                )),
            };

        default:
            return state;
    }
};