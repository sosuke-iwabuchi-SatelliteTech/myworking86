<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckUserRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role): Response
    {
        if (! $request->user()) {
            return redirect('/login');
        }

        if ($role === 'admin') {
            if (! $request->user()->isAdmin()) {
                // 利用者から管理者の場合は管理者ログイン画面
                // 認可外のページに移った場合はログインユーザーを切り替える
                auth()->guard('web')->logout();
                return redirect()->route('login');
            }
        }

        if ($role === 'user') {
            if (! $request->user()->isUser()) {
                // 管理者から利用者の場合はクイズトップ
                // 認可外のページに移った場合はログインユーザーを切り替える
                auth()->guard('web')->logout();
                return redirect('/');
            }
        }

        return $next($request);
    }
}
