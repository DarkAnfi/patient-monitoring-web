import { OptionsObject, SnackbarKey, SnackbarMessage } from "notistack";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";
import SocketService from 'services/SocketService';

declare global {
    type SyncAction<T = any> = { payload?: T; } & Action<string>;
    type SocketAction<T = any> = { types?: String[]; promise?: (client: SocketService, dispatch: Dispatch<AnyAction>, getState: () => any) => Promise<T>; } & SyncAction<T>;
    type AsyncAction<A extends Action = SyncAction, R = void, E = any> = ThunkAction<Promise<R>, RootState, E, A>;
    type Populate<T, R> = Omit<T, keyof R> & R;

    type RouteProps = {
        isAuthenticated: boolean;
    } & RouteProps;

    type UrlParams = {
        patientId?: string;
    };

    interface Summary {
        value?: string;
        fontSize?: number;
        color?: string;
        bold?: boolean;
        italic?: boolean;
        textAlign?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
        fontSizeValue?: number;
        colorValue?: string;
        boldValue?: boolean;
        italicValue?: boolean;
        textAlignValue?: 'start' | 'end' | 'left' | 'right' | 'center' | 'justify' | 'match-parent';
        children?: JSX.Element;
    }

    interface Dict<T = any> {
        [key: string]: T;
    }

    declare module "*.ttf" {
        const content: any;
        export default content;
    }

    declare module "*.otf" {
        const content: any;
        export default content;
    }

    declare module "*.glb" {
        const content: string;
        export default content;
    }
}
