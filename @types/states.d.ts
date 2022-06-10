import React from 'react';
import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";

declare global {

  type ModalType = 'default' | 'info' | 'warning' | 'error';

  interface BasicModal {
    isOpen: boolean;
    title: string;
    size: "xs" | "sm" | "md" | "lg" | "xl";
    content: React.ReactNode;
  }

  interface InfoModal extends BasicModal {
    type: ModalType;
    hideModalFooter: boolean;
    buttonText: string;
    onOk: () => void;
  }

  interface ConfirmModal extends BasicModal {
    type: ModalType;
    fullWidth: boolean;
    onConfirm: () => boolean | void;
    onCancel: () => boolean | void;
  }

  interface BreadCrumbItem {
    title: string;
    to?: string;
  }

  interface UIState {
    isDarkActive: boolean;
    isMainMenuOpen: boolean;
    infoModal: InfoModal;
    confirmModal: ConfirmModal;
    breadcrumbs: BreadCrumbItem[];
    paddingEnable: boolean;
    snackbars: ({
      key: SnackbarKey;
      message: SnackbarMessage;
      variant?: 'success' | 'warning' | 'error' | 'default';
      icon?: string;
      showCloseButton?: boolean;
      dismissed: boolean;
    } & Dict)[];
  }

  interface AuthError {
    type: any;
    message: string | null;
  }

  interface AuthState {
    user: User | null;
    token: string | null;
    checking: boolean;
    isLoading: boolean;
    error: AuthError;
  }

  interface PatientState {
    patients: Patient[]; // TODO: Crear interface
  }

  interface RootState {
    ui: UIState;
    auth: AuthState;
    patient: PatientState;
  }
}