<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Task;

class TaskController extends Controller
{
    public function index(Request $request)
    {
        $query = Task::query();
    
        if ($request->has('status') && $request->status != '') {
            $query->where('status', $request->status);
        }
    
        if ($request->has('due_date') && $request->due_date != '') {
            $query->whereDate('due_date', $request->due_date);
        }
    
        $tasks = $query->get();
    
        return response()->json($tasks);
    }

    public function show($id) {
        return Task::find($id);
    }

    public function store(Request $request) {
        $task = Task::create($request->all());
        return response()->json($task, 201);
    }

    public function update(Request $request, $id) {
        $task = Task::find($id);
        $task->update($request->all());
        return response()->json($task, 200);
    }

    public function destroy($id) {
        Task::destroy($id);
        return response()->json(null, 204);
    }
}
