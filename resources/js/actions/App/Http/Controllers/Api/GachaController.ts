import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
export const status = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

status.definition = {
    methods: ["get","head"],
    url: '/api/gacha/status',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
status.url = (options?: RouteQueryOptions) => {
    return status.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
status.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
status.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: status.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
const statusForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
statusForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\GachaController::status
* @see app/Http/Controllers/Api/GachaController.php:24
* @route '/api/gacha/status'
*/
statusForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: status.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

status.form = statusForm

/**
* @see \App\Http\Controllers\Api\GachaController::pull
* @see app/Http/Controllers/Api/GachaController.php:46
* @route '/api/gacha/pull'
*/
export const pull = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pull.url(options),
    method: 'post',
})

pull.definition = {
    methods: ["post"],
    url: '/api/gacha/pull',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\GachaController::pull
* @see app/Http/Controllers/Api/GachaController.php:46
* @route '/api/gacha/pull'
*/
pull.url = (options?: RouteQueryOptions) => {
    return pull.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\GachaController::pull
* @see app/Http/Controllers/Api/GachaController.php:46
* @route '/api/gacha/pull'
*/
pull.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: pull.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\GachaController::pull
* @see app/Http/Controllers/Api/GachaController.php:46
* @route '/api/gacha/pull'
*/
const pullForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pull.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\GachaController::pull
* @see app/Http/Controllers/Api/GachaController.php:46
* @route '/api/gacha/pull'
*/
pullForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: pull.url(options),
    method: 'post',
})

pull.form = pullForm

const GachaController = { status, pull }

export default GachaController