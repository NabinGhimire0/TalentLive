<?php

use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CourseController;
use App\Http\Controllers\CourseEnrollmentController;
use App\Http\Controllers\CourseTimeStampController;
use App\Http\Controllers\DropDownController;
use App\Http\Controllers\EducationController;
use App\Http\Controllers\MMRController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SearchController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\SpecificCourseController;
use App\Http\Controllers\VideoCallController;
use App\Http\Controllers\WorkHistoryController;
use App\Http\Middleware\CorsMiddleware;
use App\Http\Middleware\JwtMiddleware;
use App\Http\Middleware\RoleMiddleware;
use Illuminate\Http\Middleware\HandleCors;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/videos/{filename}', function ($filename) {
    $path = public_path('uploads/courses/videos/' . $filename);

    if (!file_exists($path)) {
        abort(404);
    }

    return response()->file($path, [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
    ]);
})->name('video.show');

// Handle OPTIONS request for CORS preflight
Route::options('/videos/{filename}', function () {
    return response('', 200, [
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, OPTIONS',
        'Access-Control-Allow-Headers' => 'Origin, Content-Type, Accept, Authorization, X-Requested-With',
    ]);
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
        Route::get('/user', [AuthController::class, 'users']);
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
        Route::get('user/courses', [SpecificCourseController::class, 'userCourses']);
        Route::get('/user/courses/{id}', [SpecificCourseController::class, 'userSingleCourse']);

        // Protected video access route (for authenticated users only)
        Route::get('/secure-videos/{filename}', function ($filename) {
            $path = public_path('uploads/courses/videos/' . $filename);

            if (!file_exists($path)) {
                abort(404);
            }

            return response()->file($path);
        })->name('video.secure');

        Route::get('profile', [ProfileController::class, 'show']); // Authenticated user's profile
        Route::get('profile/{id}', [ProfileController::class, 'show']);


        Route::get('/contacts', [VideoCallController::class, 'getContacts']);
        Route::post('/video-call/request/{userId}', [VideoCallController::class, 'requestVideoCall']);
        Route::post('/video-call/status/{userId}', [VideoCallController::class, 'requestVideoCallStatus']);
    });

    Route::get('payment/success', [CourseEnrollmentController::class, 'paymentSuccess']);
    Route::get('payment/failure', [CourseEnrollmentController::class, 'paymentFailure']);
    Route::get('/companies', [DropDownController::class, 'getCompany']);
    Route::get('frontend/courses', [SpecificCourseController::class, 'homeCourses']);
    Route::get('frontend/courses/{id}', [SpecificCourseController::class, 'publicCourse']);
    Route::get('profiles', [ProfileController::class, 'index']); // Fetch all users' profiles (admin only)

    Route::middleware(RoleMiddleware::class . ':admin,superadmin')->group(function () {});
});
