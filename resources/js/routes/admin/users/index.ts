import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../wayfinder'
/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/admin/users',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::index
* @see app/Http/Controllers/Web/Admin/UserController.php:25
* @route '/admin/users'
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
* @see \App\Http\Controllers\Web\Admin\UserController::updatePoints
* @see app/Http/Controllers/Web/Admin/UserController.php:39
* @route '/admin/users/{user}/points'
*/
export const updatePoints = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePoints.url(args, options),
    method: 'put',
})

updatePoints.definition = {
    methods: ["put"],
    url: '/admin/users/{user}/points',
} satisfies RouteDefinition<["put"]>

/**
* @see \App\Http\Controllers\Web\Admin\UserController::updatePoints
* @see app/Http/Controllers/Web/Admin/UserController.php:39
* @route '/admin/users/{user}/points'
*/
updatePoints.url = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { user: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { user: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            user: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        user: typeof args.user === 'object'
        ? args.user.id
        : args.user,
    }

    return updatePoints.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Web\Admin\UserController::updatePoints
* @see app/Http/Controllers/Web/Admin/UserController.php:39
* @route '/admin/users/{user}/points'
*/
updatePoints.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteDefinition<'put'> => ({
    url: updatePoints.url(args, options),
    method: 'put',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::updatePoints
* @see app/Http/Controllers/Web/Admin/UserController.php:39
* @route '/admin/users/{user}/points'
*/
const updatePointsForm = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePoints.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Web\Admin\UserController::updatePoints
* @see app/Http/Controllers/Web/Admin/UserController.php:39
* @route '/admin/users/{user}/points'
*/
updatePointsForm.put = (args: { user: string | { id: string } } | [user: string | { id: string } ] | string | { id: string }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: updatePoints.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'PUT',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'post',
})

updatePoints.form = updatePointsForm

const users = {
    index: Object.assign(index, index),
    updatePoints: Object.assign(updatePoints, updatePoints),
}

export default users