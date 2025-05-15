import { ReactNode, PropsWithChildren } from 'react';

export interface LicenseFlags extends Record<string, number | string | string[] | boolean | Record<string, any>> {
    '@tenants/maxAmount': number;
    '@tenants/enablePreview': boolean;
    '@tenants/helloMessage': { message: string };
    '@tenants/enabledNotificationMethods': ('email' | 'push' | 'call')[];
}

type FlagValue<T extends keyof LicenseFlags> = LicenseFlags[T] | undefined

/**
 * Сигнатура стора, держащего значения о фиче-флагах
 */
type UseLicenseFeaturesClient = {
    flags: LicenseFlags;
    /**
     * Is not needed (YAGNI)
     */
    refetch: () => void;
    isLoading: boolean;
    isFetching: boolean;
}

/**
 * Сигнатура функции, возвращающей значение флага
 */
type UseLicenseFeatureHook<T extends keyof LicenseFlags> = {
    (featureFlag: T): FlagValue<T>
}

type LicenseFeatureProps<T extends keyof LicenseFlags> = {
    /**
     * Флаг
     */
    flag: T
    /**
     * Компонент для отображения, если флаг не активен
     */
    fallback?: ReactNode;
    /**
     * flagValue === matchResult
     *      ? display children
     *      : display fallback (if exists)
     * @default true
     */
    match?: boolean | ((flagValue: FlagValue<T>, flagKey: string) => boolean),
    children: ReactNode | ((flagValue: Exclude<FlagValue<T>, undefined>, flagKey: string) => ReactNode)
}


/**
 * @example
 * const boolFlag = (<LicenseFeature flag={'@tenants/enablePreview'} fallback={<p>Flag is disabled</p>}>
 *     <p>Hello world</p>
 * </LicenseFeature>);
 *
 * const numFlagMatch = (
 *     <LicenseFeature flag={'@tenants/maxAmount'} match={(value) => !!value && value > 10}>
 *         <p>Flag is greater then 10</p>
 *     </LicenseFeature>
 * );
 *
 * const arrayFlagExists = (
 *     <LicenseFeature flag={'@tenants/enabledNotificationMethods'}>
 *         <p>This flag is just defined</p>
 *     </LicenseFeature>
 * );
 *
 * const objFlagWithChildFunction = (
 *     <LicenseFeature flag={'@tenants/helloMessage'}>
 *         {(value) => (
 *             <>
 *                 <p>The value is defined here and it's cool</p>
 *                 <p>Hello {value.message}</p>
 *             </>
 *         )}
 *     </LicenseFeature>
 * );
 */
type LicenseFeatureComponent<T extends keyof LicenseFlags> = {
    (props: LicenseFeatureProps<T>): ReactNode;
}

export function LicenseFeature<T extends keyof LicenseFlags>(props: LicenseFeatureProps<T>) {
    console.log(props.flag)
    return <p>Testing</p>;
}

const boolFlag = (<LicenseFeature flag={'@tenants/enablePreview'} fallback={<p>Flag is disabled</p>}>
    <p>Hello world</p>
</LicenseFeature>);

const numFlagMatch = (
    <LicenseFeature flag={'@tenants/maxAmount'} match={(value) => !!value && value > 10}>
        <p>Flag is greater then 10</p>
    </LicenseFeature>
);

const arrayFlagExists = (
    <LicenseFeature flag={'@tenants/enabledNotificationMethods'}>
        <p>This flag is just defined</p>
    </LicenseFeature>
);

const objFlagWithChildFunction = (
    <LicenseFeature flag={'@tenants/helloMessage'}>
        {(value) => (
            <>
                <p>The value is defined here and it's cool</p>
                <p>Hello {value.message}</p>
            </>
        )}
    </LicenseFeature>
);

//function LicenseFeature<T extends keyof LicenseFlags>(props: LicenseFeatureProps<T>): ReactNode {
//    const licenseFeature = useLicenseFeature(props.flag);
//
//
//}

/**
 * НЕ ДЕЛАЕМ (YAGNI)
 * Сигнатура функции, возвращающей информацию о фиче-флаге
 *
 * Может быть полезна для извлечения доп-информации из хука, если информация потребуется
 */
//type UseLicenseFeatureInfoHook<T extends keyof LicenseFlags> = {
//    (featureFlag: T): FlagInfo<T>
//}

/**
 * Не далаем (YAGNI). Пока можно использовать просто (key: value) структуру
 */
interface LicenseFlagInfo<T> {
    value: T;
}
