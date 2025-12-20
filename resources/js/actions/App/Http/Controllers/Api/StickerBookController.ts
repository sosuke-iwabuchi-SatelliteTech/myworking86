import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../../wayfinder'
/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
const index81bdde02c119c9ebadcb5a6d4af009a4 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index81bdde02c119c9ebadcb5a6d4af009a4.url(options),
    method: 'get',
})

index81bdde02c119c9ebadcb5a6d4af009a4.definition = {
    methods: ["get","head"],
    url: '/api/sticker-book',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
index81bdde02c119c9ebadcb5a6d4af009a4.url = (options?: RouteQueryOptions) => {
    return index81bdde02c119c9ebadcb5a6d4af009a4.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
index81bdde02c119c9ebadcb5a6d4af009a4.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index81bdde02c119c9ebadcb5a6d4af009a4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
index81bdde02c119c9ebadcb5a6d4af009a4.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index81bdde02c119c9ebadcb5a6d4af009a4.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
const index81bdde02c119c9ebadcb5a6d4af009a4Form = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index81bdde02c119c9ebadcb5a6d4af009a4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
index81bdde02c119c9ebadcb5a6d4af009a4Form.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index81bdde02c119c9ebadcb5a6d4af009a4.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/sticker-book'
*/
index81bdde02c119c9ebadcb5a6d4af009a4Form.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index81bdde02c119c9ebadcb5a6d4af009a4.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index81bdde02c119c9ebadcb5a6d4af009a4.form = index81bdde02c119c9ebadcb5a6d4af009a4Form
/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
const index216f5e84bec0095d166f92f560c517d1 = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index216f5e84bec0095d166f92f560c517d1.url(args, options),
    method: 'get',
})

index216f5e84bec0095d166f92f560c517d1.definition = {
    methods: ["get","head"],
    url: '/api/users/{user}/sticker-book',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
index216f5e84bec0095d166f92f560c517d1.url = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions) => {
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

    return index216f5e84bec0095d166f92f560c517d1.definition.url
            .replace('{user}', parsedArgs.user.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
index216f5e84bec0095d166f92f560c517d1.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index216f5e84bec0095d166f92f560c517d1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
index216f5e84bec0095d166f92f560c517d1.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index216f5e84bec0095d166f92f560c517d1.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
const index216f5e84bec0095d166f92f560c517d1Form = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index216f5e84bec0095d166f92f560c517d1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
index216f5e84bec0095d166f92f560c517d1Form.get = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index216f5e84bec0095d166f92f560c517d1.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::index
* @see app/Http/Controllers/Api/StickerBookController.php:18
* @route '/api/users/{user}/sticker-book'
*/
index216f5e84bec0095d166f92f560c517d1Form.head = (args: { user: string | number } | [user: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index216f5e84bec0095d166f92f560c517d1.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index216f5e84bec0095d166f92f560c517d1.form = index216f5e84bec0095d166f92f560c517d1Form

export const index = {
    '/api/sticker-book': index81bdde02c119c9ebadcb5a6d4af009a4,
    '/api/users/{user}/sticker-book': index216f5e84bec0095d166f92f560c517d1,
}

/**
* @see \App\Http\Controllers\Api\StickerBookController::store
* @see app/Http/Controllers/Api/StickerBookController.php:33
* @route '/api/sticker-book'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/api/sticker-book',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\Api\StickerBookController::store
* @see app/Http/Controllers/Api/StickerBookController.php:33
* @route '/api/sticker-book'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\Api\StickerBookController::store
* @see app/Http/Controllers/Api/StickerBookController.php:33
* @route '/api/sticker-book'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::store
* @see app/Http/Controllers/Api/StickerBookController.php:33
* @route '/api/sticker-book'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\Api\StickerBookController::store
* @see app/Http/Controllers/Api/StickerBookController.php:33
* @route '/api/sticker-book'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

const StickerBookController = { index, store }

export default StickerBookController