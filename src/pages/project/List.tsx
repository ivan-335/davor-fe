import { useState, useEffect, useCallback } from 'react';
import ProjectsTable from '../../components/ProjectsTable';
import ProjectModal from '../../components/ProjectModal';
import type { Project } from '../../types/Project';

export default function ProjectsPage() {
    const [projects, setProjects] = useState<Project[]>([]);
    const [showModal, setShowModal] = useState(false);
    const [editingProject, setEditingProject] = useState<Project | undefined>(undefined);
    const [search, setSearch] = useState<string>('');
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(6);

    async function loadProjects() {
        try {
            const params = new URLSearchParams({
                page: String(page),
            });
            if (search.trim().length >= 2) {
                params.set('title', search.trim());
            }
            const res = await fetch(`http://localhost:4000/api/projects?${params}`);
            const data = await res.json();
            setProjects(data.projects);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        loadProjects();
    }, [search, page, limit]);

    const handleAdd = useCallback(() => {
        setEditingProject(undefined);
        setShowModal(true);
    }, []);

    const handleEdit = useCallback((project: Project) => {
        setEditingProject(project);
        setShowModal(true);
    }, []);

    const handleDelete = useCallback((project: Project) => {
        if (!window.confirm(`Delete "${project.title}"?`)) return;
        fetch(`http://localhost:4000/api/projects/${project._id}`, { method: 'DELETE' })
            .then(() => setProjects((prev) => prev.filter((p) => p._id !== project._id)))
            .catch((err) => console.error(err));
    }, []);

    const handleSave = useCallback(
        async (payload: {
            id: string;
            title: string;
            description?: string;
            status: number;
            budget: string;
            deadline?: Date;
            userId?: string;
        }) => {
            const isEdit = Boolean(editingProject);
            const url = isEdit ? `http://localhost:4000/api/projects/${editingProject!._id}` : 'http://localhost:4000/api/projects';
            const method = isEdit ? 'PUT' : 'POST';
            const body = {
                ...payload,
                deadline: payload.deadline ? payload.deadline.toISOString() : undefined,
            }
            fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((newOrUpdated: Project) => {
                    if (isEdit) {
                        setProjects((prev) =>
                            prev.map((p) => (p._id === newOrUpdated._id ? newOrUpdated : p))
                        );
                    } else {
                        setProjects((prev) => [newOrUpdated, ...prev]);
                    }
                    setShowModal(false);
                })
                .catch((err) => console.error(err));
        },
        [editingProject]
    );

    const handleSearchChange = (newSearch: string) => {
        setPage(1);
        setSearch(newSearch);
    };

    const handlePageChange = (newPage: number) => {
        setPage(newPage);
    };

    return (
        <div className="p-6">
            <button
                onClick={handleAdd}
                className="mb-4 px-4 py-2 bg-black bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
                + Add Project
            </button>

            <ProjectsTable
                data={projects}
                searchValue={search}
                onSearchChange={handleSearchChange}
                pageIndex={page}
                onPageChange={handlePageChange}
                pageSize={limit}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            {showModal && (
                <ProjectModal
                    initialData={editingProject}
                    onSave={handleSave}
                    onClose={() => setShowModal(false)}
                />
            )}
        </div>
    );
}
