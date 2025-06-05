const unsetMarker = Symbol();
export type UnsetMarker = typeof unsetMarker

type DefaultValue<TValue, TFallback> = TValue extends UnsetMarker ? TFallback : TValue;

export type ProcedureResolverOptions<TInput = UnsetMarker> = {
    input: TInput extends UnsetMarker ? undefined : TInput
}

type MaybePromise<T> = Promise<T> | T

type ProcedureResolver<TInputOut, $Output> = (opts: ProcedureResolverOptions<TInputOut>) => MaybePromise<$Output>;

export type ProcedureBuilder<
    TInput,
    TOutput,
> = {
    query<$Output, $Input>(resolver: ProcedureResolver<$Input, $Output>): PublicApiCallReturn<'query', DefaultValue<$Input, void>, $Output>
    mutation<$Output, $Input>(resolver: ProcedureResolver<$Input, $Output>): PublicApiCallReturn<'mutation', DefaultValue<$Input, void>, $Output>
    _def: AnyProcedureBuilderDef
}

type AnyProcedureBuilder = ProcedureBuilder<any, any>;

export function createBuilder(
    initDef: Partial<AnyProcedureBuilderDef> = {},
): ProcedureBuilder<UnsetMarker, UnsetMarker> {
    const _def: AnyProcedureBuilderDef = {
        ...initDef,
    };

    const builder: AnyProcedureBuilder = {
        _def,
        // @ts-expect-error
        query(resolver) {
            return createResolver({ ..._def, type: 'query' }, resolver) as unknown as AnyQueryProcedure;
        },
        // @ts-expect-error
        mutation(resolver) {
            return createResolver({ ..._def, type: 'mutation' }, resolver) as unknown as AnyMutationProcedure;
        }
    };
    return builder;
}

type ProcedureBuilderResolver = (
    opts: ProcedureResolverOptions<any>,
) => Promise<unknown>

type ProcedureBuilderDef = {
//    procedure: true;
//    inputs: Parser[];
//    output?: Parser;
    resolver?: ProcedureBuilderResolver;
//    middlewares: AnyMiddlewareFunction[];
    type?: ProcedureType;
//    caller?: CallerOverride<unknown>;
}

type AnyProcedureBuilderDef = ProcedureBuilderDef
type AnyResolver = ProcedureResolver<any, any>;

function createResolver(def: AnyProcedureBuilderDef & {
    type: ProcedureType
}, resolver: AnyResolver) {
//    return (params: unknown) => resolver(params);

    const handler = (input: unknown) => {
        return resolver({ input });
    };

    return { type: def.type, handler };
}

interface BuiltProcedureDef {
    input: unknown;
    output: unknown;
}

export const procedureTypes = [ 'query', 'mutation', 'subscription' ] as const;
export type ProcedureType = (typeof procedureTypes)[number];

export type GetRawInputFn = () => Promise<unknown>;

export interface ProcedureCallOptions<TContext> {
    ctx: TContext;
    getRawInput: GetRawInputFn;
    input?: unknown;
    path: string;
    type: ProcedureType;
    signal: AbortSignal | undefined;
}

type PublicApiCallReturn<TType extends ProcedureType, TInput, TOut> = {
    type: TType;
    handler: (input: TInput) => Promise<TOut>
}

export interface Procedure<
    TType extends ProcedureType,
    TDef extends BuiltProcedureDef,
> {
//    _def: {
//        $types: {
//            input: TDef['input'];
//            output: TDef['output'];
//        };
//        procedure: true;
//        type: TType;
//    };

    type: TType;

    handler: (opts: ProcedureCallOptions<unknown>) => Promise<TDef['output']>;
}

export interface QueryProcedure<TDef extends BuiltProcedureDef>
    extends Procedure<'query', TDef> {}

type AnyQueryProcedure = QueryProcedure<any>

export interface MutationProcedure<TDef extends BuiltProcedureDef>
    extends Procedure<'mutation', TDef> {}

type AnyMutationProcedure = MutationProcedure<any>

export interface SubscriptionProcedure<TDef extends BuiltProcedureDef>
    extends Procedure<'subscription', TDef> {}

function createNewBuilder(
    def1: AnyProcedureBuilderDef,
    def2: Partial<AnyProcedureBuilderDef>,
): AnyProcedureBuilder {
    return createBuilder(def1);
}
