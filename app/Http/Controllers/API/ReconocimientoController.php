<?php

namespace App\Http\Controllers\API;

use App\Helpers\FilterHelper;
use App\Http\Controllers\Controller;
use App\Http\Resources\ReconocimientoResource;
use App\Models\Reconocimiento;
use Illuminate\Http\Request;

class ReconocimientoController extends Controller
{
    public $modelclass = Reconocimiento::class;

    /**
     * Create the controller instance.
     *
     * @return void
     */

    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
        $this->authorizeResource(Reconocimiento::class, 'reconocimiento');
    }

    public function index(Request $request)
    {
        $campos = [];
        $otrosFiltros = ['estudiante_id', 'actividad_id', 'docente_validador'];
        $query = FilterHelper::applyFilter($request, $campos, $otrosFiltros);
        $request->attributes->set('total_count', $query->count());
        $queryOrdered = FilterHelper::applyOrder($query, $request);
        return ReconocimientoResource::collection(
            $query->orderBy($request->_sort ?? 'id', $request->_order ?? 'asc')
                ->paginate($request->perPage)
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $reconocimiento = json_decode($request->getContent(), true);
        $user = auth()->user();
        if($user->esEstudiante())
            $reconocimiento['estudiante_id'] = $user->id;

        if($user->esDocente())
            $reconocimiento['docente_validador'] = $user->id;
        else{
            unset($reconocimiento['docente_validador']);
        }
        $reconocimiento = Reconocimiento::create($reconocimiento);

        return new ReconocimientoResource($reconocimiento);
    }

    /**
     * Display the specified resource.
     */
    public function show(Reconocimiento $reconocimiento)
    {
        return new ReconocimientoResource($reconocimiento);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Reconocimiento $reconocimiento)
    {
        $reconocimientoData = json_decode($request->getContent(), true);
        $user = auth()->user();
        if(!$user->esAdmin() && !$user->esDocente())
            $reconocimientoData['docente_validador'] = $reconocimiento->docente_validador;
        $reconocimiento->update($reconocimientoData);

        return new ReconocimientoResource($reconocimiento);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Reconocimiento $reconocimiento)
    {
        $reconocimiento->delete();
    }

    public function validar($id)
    {
        $this->authorize('validar', Reconocimiento::class);
        $reconocimiento = Reconocimiento::findOrFail($id);

        $reconocimiento->docente_validador = auth()->user()->id;
        $reconocimiento->fecha = date('d/m/Y');
        $reconocimiento->save();

        return new ReconocimientoResource($reconocimiento);
    }
}
