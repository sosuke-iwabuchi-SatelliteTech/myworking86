import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\UserController::login
* @see app/Http/Controllers/Api/UserController.php:36
* @route '/login'
*/
export const login = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

login.definition = {
    methods: ["post"],
    url: '/login',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::login
* @see app/Http/Controllers/Api/UserController.php:36
* @route '/login'
*/
login.url = (options?: RouteQueryOptions) => {
    return login.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::login
* @see app/Http/Controllers/Api/UserController.php:36
* @route '/login'
*/
login.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::login
* @see app/Http/Controllers/Api/UserController.php:36
* @route '/login'
*/
const loginForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::login
* @see app/Http/Controllers/Api/UserController.php:36
* @route '/login'
*/
loginForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: login.url(options),
    method: 'post',
})

login.form = loginForm

/**
* @see \App\Http\Controllers\Api\UserController::store
* @see app/Http/Controllers/Api/UserController.php:17
* @route '/api/user'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/user',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\UserController::store
* @see app/Http/Controllers/Api/UserController.php:17
* @route '/api/user'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\UserController::store
* @see app/Http/Controllers/Api/UserController.php:17
* @route '/api/user'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::store
* @see app/Http/Controllers/Api/UserController.php:17
* @route '/api/user'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\UserController::store
* @see app/Http/Controllers/Api/UserController.php:17
* @route '/api/user'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const UserController = { login, store }

export default UserController