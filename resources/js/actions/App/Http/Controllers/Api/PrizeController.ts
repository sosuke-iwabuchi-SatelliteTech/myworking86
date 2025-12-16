import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/api/prizes',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PrizeController::index
* @see Http/Controllers/Api/PrizeController.php:10
* @route '/api/prizes'
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

const PrizeController = { index }

export default PrizeController