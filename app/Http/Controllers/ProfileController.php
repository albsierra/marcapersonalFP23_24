<?php

namespace App\Http\Controllers;

use App\Models\Actividad;
use App\Models\Curriculo;
use App\Models\Reconocimiento;
use App\Models\User;
use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());

        if ($request->user()->isDirty('email')) {
            $request->user()->email_verified_at = null;
        }

        $request->user()->save();

        return Redirect::route('profile.edit');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }

    public function postAvatar(Request $request, $id)
    {
        // TODO: Eliminar el avatar anterior si existiera
        if ($request->file('avatar')) {
            $user = User::findOrFail($id);
            $path = $request->file('avatar')->store('avatars', ['disk' => 'public']);
            $user->avatar = $path;
            $user->save();
        }

        return Redirect::route('profile.edit')->with('status', 'avatar-updated');
    }

    public function getAvatar($id)
    {
        $user = User::findOrFail($id);
        $url = asset('storage/' . $user->avatar);

        return response()->json(['avatarUrl' => $url]);
    }

    public function getCurriculo($id)
    {
        $curriculo = Curriculo::where('user_id', $id)->firstOrFail();
        $curriculoUrl = $curriculo->pdf_curriculum != null
            ? asset('storage/' . $curriculo->pdf_curriculum)
            : null;

        return response()->json([
            'curriculoUrl' => $curriculoUrl,
            'curriculo' => $curriculo
        ]);
    }

    public function postCurriculo(Request $request, $id)
    {
        // TODO: Eliminar el currículo anterior si existiera
        $curriculo = Curriculo::where('user_id', $id)->firstOrFail();
        if ($request->hasFile('pdf_curriculum') && $request->pdf_curriculum->getClientOriginalExtension() === 'pdf') {
            $path = $request->file('pdf_curriculum')->store('curriculos', ['disk' => 'public']);
            $curriculo->pdf_curriculum = $path;
        }
        if ($request->has('video_curriculum')) {
            $curriculo->video_curriculum = $request->video_curriculum;
        }

        $curriculo->save();

        return Redirect::route('profile.edit')->with('status', 'curriculum-updated');
    }

    public function getActividades($id)
    {
        $user = User::findOrFail($id);
        $actividades_id = Reconocimiento::where('estudiante_id', $user->id)->pluck('actividad_id');
        $actividades = Actividad::whereIn('id', $actividades_id)->get();

        return response()->json(['actividades' => $actividades]);
    }
}
