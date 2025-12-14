import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
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

const UserPrizeController = { store, index, tradable }

export default UserPrizeController