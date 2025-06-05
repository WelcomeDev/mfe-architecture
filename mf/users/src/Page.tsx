import * as React from 'react';
import MuiPackageJson from '@mui/material/package.json';
import { licenseApi } from './licenseApi';

export default () => {

    const { status, isFetching, tryAgain } = licenseApi.useClientInit();

    return (
        <>
            <h1>Title</h1>
            <p>Mui version: {MuiPackageJson.version}</p>
            <p>Hello world!!!</p>
            {isFetching && <p>{'Loading todo api...'}</p>}
            {status === 'success' && <TheTodoApiUsage/>}
            {status === 'error' &&
                <div style={{padding:'8px 12px', border:'1px solid lightgray', borderRadius: 16}}>
                    <p>Couldn't connect licenseApi</p>
                    <button onClick={tryAgain}>Try again</button>
                </div>
            }
        </>
    );
};

const options = [ 'one', 'random', null ];

function TheTodoApiUsage() {
    const { data: license, isFetching, refetch } = licenseApi.useQueryClient('getLicense', undefined);

    const { mutate: refreshLicense, isPending: isRefreshLicensePending } = licenseApi.useMutationClient('refreshLicense', {
        onSuccess: () => refetch(),
    });

    const licenseKey = '1234';

    const { mutate: isKeyMatch, isPending: isKeyMatchPending } = licenseApi.useMutationClient('isValid', {
        onSuccess: () => alert(`Key ${licenseKey} is matching`),
    });

    return (
        <>
            {isFetching && <p>{'Fetching todo...'}</p>}
            {
                !isFetching && <p>
                    {'The license:'} {license?.dueDate}
                </p>
            }
            <button onClick={() => refreshLicense()}>
                Refresh license {isRefreshLicensePending && <span>Loading...</span>}
            </button>
            <button onClick={() => isKeyMatch({ key: licenseKey })}>
                Validate {licenseKey} {isKeyMatchPending && <span>Loading...</span>}
            </button>
            {
                options.map((it, index) => (
                    <Options name={it} key={index}/>
                ))
            }
        </>
    );
}

function Options({ name }: { name: string | null }) {
    return (
        <p>{name ?? 'Nullish'} is included: <OptionName name={name}/></p>
    );
}

function OptionName({ name }: { name: string | null }) {
    const enabled = !!name;

    if (!enabled) return <span>Is not defined</span>;
    const { data, isLoading } = licenseApi.useQueryClient('checkOption', { option: name! }, { enabled });

    if (isLoading && enabled) {
        return <span>Loading...</span>;
    }
    return <span>{String(data?.isIncluded)}</span>;
}
