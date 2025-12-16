import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\PointController::award
* @see Http/Controllers/Api/PointController.php:15
* @route '/api/points/award'
*/
export const award = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: award.url(options),
    method: 'post',
})

award.definition = {
    methods: ["post"],
    url: '/api/points/award',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\PointController::award
* @see Http/Controllers/Api/PointController.php:15
* @route '/api/points/award'
*/
award.url = (options?: RouteQueryOptions) => {
    return award.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PointController::award
* @see Http/Controllers/Api/PointController.php:15
* @route '/api/points/award'
*/
award.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: award.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PointController::award
* @see Http/Controllers/Api/PointController.php:15
* @route '/api/points/award'
*/
const awardForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: award.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\PointController::award
* @see Http/Controllers/Api/PointController.php:15
* @route '/api/points/award'
*/
awardForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: award.url(options),
    method: 'post',
})

award.form = awardForm

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
export const show = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/api/points',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
show.url = (options?: RouteQueryOptions) => {
    return show.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
show.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
show.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
const showForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
showForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\PointController::show
* @see Http/Controllers/Api/PointController.php:67
* @route '/api/points'
*/
showForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

const PointController = { award, show }

export default PointController