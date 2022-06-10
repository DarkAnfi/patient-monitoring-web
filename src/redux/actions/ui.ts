import { SnackbarKey } from 'notistack';
import ui from 'redux/types/ui';

export const toggleDarkMode = (): SyncAction => ({ type: ui.toggleDarkMode });
export const toggleMainMenu = (): SyncAction => ({ type: ui.toggleMainMenu });

export const openInfoModal = (): SyncAction => ({ type: ui.openInfoModal });
export const closeInfoModal = (): SyncAction => ({ type: ui.closeInfoModal });
export const resetInfoModalState = (): SyncAction => ({ type: ui.resetInfoModalState });
export const setInfoModalState = ({ title, type = 'default' as const, buttonText = 'Ok', content, hideModalFooter = false, size = 'sm', onOk = () => { } }: {
    title?: string,
    buttonText?: string
    size?: string,
    hideModalFooter?: boolean,
    content?: React.ReactNode,
    type?: ModalType,
    onOk?: () => void,
}): SyncAction => {
    const payload: Dict = {};
    if (!!title) payload['title'] = title;
    if (!!buttonText) payload['buttonText'] = buttonText;
    if (!!size) payload['size'] = size;
    if (!!content) payload['content'] = content;
    if (!!type) payload['type'] = type;
    if (!!onOk) payload['onOk'] = onOk;
    if (!!hideModalFooter) payload['hideModalFooter'] = hideModalFooter;
    return {
        type: ui.setInfoModalState,
        payload,
    };
};

export const openConfirmModal = (): SyncAction => ({ type: ui.openConfirmModal });
export const setPaddingEnable = (value: boolean): SyncAction => ({ type: ui.setPaddingEnable, payload: value });
export const closeConfirmModal = (): SyncAction => ({ type: ui.closeConfirmModal });
export const resetConfirmModalState = (): SyncAction => ({ type: ui.resetConfirmModalState });
export const setConfirmModalTitle = (title: string): SyncAction => ({ type: ui.setConfirmModalTitle, payload: title });
export const setInfoModalTitle = (title: string): SyncAction => ({ type: ui.setInfoModalTitle, payload: title });
export const setConfirmModalState = ({ title, type = 'default' as const, content, size = 'sm', fullWidth = false, onConfirm = () => { }, onCancel = () => { } }: {
    title: string,
    size?: string,
    content: React.ReactNode,
    fullWidth?: boolean,
    type?: ModalType,
    onConfirm?: () => boolean | void,
    onCancel?: () => boolean | void,
}): SyncAction => {
    return {
        type: ui.setConfirmModalState,
        payload: { title, type, content, fullWidth, onConfirm, onCancel, size },
    };
};

export const setBreadCrumbs = (breadcrumbs: BreadCrumbItem[]) => ({ type: ui.setBreadcrumbs, payload: breadcrumbs });


export const enqueueSnackbar = (snackbar: Dict) => {
    const key = snackbar.options && snackbar.options.key;
    return {
        type: ui.enqueueSnackbar,
        payload: {
            ...snackbar,
            key: key || new Date().getTime() + Math.random(),
            dismissed: false,
        }
    };
};

export const closeSnackbar = (key: SnackbarKey, dismissAll: boolean = false ) => ({
    type: ui.closeSnackbar,
    payload: {
        dismissAll: dismissAll,
        key,
    }
});