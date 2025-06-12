<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\CourseTimeStampController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\MMRController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\WorkHistoryController;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::group(['prefix' => 'api'], function () {
    Route::group(['prefix' => '/auth'], function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::middleware([JwtMiddleware::class])->group(function () {
            Route::get('/me', [AuthController::class, 'me']);
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::post('/refresh', [AuthController::class, 'refresh']);
        });
    });
    Route::middleware([JwtMiddleware::class])->group(function () {
        Route::resource('categories', CategoryController::class);
        Route::resource('skills', SkillController::class);
        Route::resource('projects', ProjectController::class);
        Route::resource('work-histories', WorkHistoryController::class);
        Route::post('work-histories/{id}/verify', [WorkHistoryController::class, 'verify']);
        Route::resource('courses', CourseController::class);
        Route::resource('course-enrollments', CourseEnrollmentController::class)->except(['update']);
        Route::post('course-timestamps', [CourseTimeStampController::class, 'store']);
        Route::put('course-timestamps/{id}', [CourseTimeStampController::class, 'update']);

        // MMR
        Route::get('mmr', [MMRController::class, 'index']);
        Route::post('mmr/recalculate', [MMRController::class, 'recalculate']);
        Route::post('mmr/github', [MMRController::class, 'updateGithub']);

        // Education routes
        Route::resource('educations', EducationController::class);

        // Search route
        Route::post('search/individuals', [SearchController::class, 'searchIndividuals']);
    });


    Route::middleware(RoleMiddleware::class . ':admin,superadmin')->group(function () {});
});
