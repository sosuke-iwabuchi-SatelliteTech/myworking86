import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserPrizeController::store
* @see app/Http/Controllers/Api/UserPrizeController.php:17
* @route '/api/user/prizes'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/user/prizes',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserPrizeController::store
* @see app/Http/Controllers/Api/UserPrizeController.php:17
* @route '/api/user/prizes'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPrizeController::store
* @see app/Http/Controllers/Api/UserPrizeController.php:17
* @route '/api/user/prizes'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::store
* @see app/Http/Controllers/Api/UserPrizeController.php:17
* @route '/api/user/prizes'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::store
* @see app/Http/Controllers/Api/UserPrizeController.php:17
* @route '/api/user/prizes'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/user/prizes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::index
* @see app/Http/Controllers/Api/UserPrizeController.php:37
* @route '/api/user/prizes'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
export const tradable = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tradable.url(options),
    method: 'get',
})

tradable.definition = {
    methods: ["get","head"],
    url: '/api/user/prizes/tradable',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
tradable.url = (options?: RouteQueryOptions) => {
    return tradable.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
tradable.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: tradable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
tradable.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: tradable.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
const tradableForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tradable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
tradableForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tradable.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::tradable
* @see app/Http/Controllers/Api/UserPrizeController.php:57
* @route '/api/user/prizes/tradable'
*/
tradableForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: tradable.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

tradable.form = tradableForm

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
export const userTradable = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userTradable.url(args, options),
    method: 'get',
})

userTradable.definition = {
    methods: ["get","head"],
    url: '/api/users/{user}/prizes/tradable',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
userTradable.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: args.user,
    }

    return userTradable.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
userTradable.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: userTradable.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
userTradable.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: userTradable.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
const userTradableForm = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userTradable.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
userTradableForm.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userTradable.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\UserPrizeController::userTradable
* @see app/Http/Controllers/Api/UserPrizeController.php:0
* @route '/api/users/{user}/prizes/tradable'
*/
userTradableForm.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: userTradable.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

userTradable.form = userTradableForm

const UserPrizeController = { store, index, tradable, userTradable }

export default UserPrizeController