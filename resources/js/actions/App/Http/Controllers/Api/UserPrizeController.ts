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

const UserPrizeController = { store, index }

export default UserPrizeController