/**
*    File        : frontend/js/controllers/subjectsController.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

import { subjectsAPI } from '../apiConsumers/subjectsAPI.js';

// Variables globales para paginación
let currentPage = 1;
let totalPages = 1;
const limit = 5;

document.addEventListener('DOMContentLoaded', () => 
{
    loadSubjects();
    setupSubjectFormHandler();
    setupCancelHandler();
    setupPaginationControlsSubject();
    setupDuplicateModalHandlers();
});

function setupSubjectFormHandler() 
{
  const form = document.getElementById('subjectForm');
  form.addEventListener('submit', async e => 
  {
        e.preventDefault();
        const subject = 
        {
            id: document.getElementById('subjectId').value.trim(),
            name: document.getElementById('name').value.trim()
        };

        try 
        {
            if (subject.id) 
            {
                await subjectsAPI.update(subject);
            }
            else
            {
                // Antes de crear, verificar que no exista una materia con el mismo nombre
                const allSubjects = await subjectsAPI.fetchAll();
                const exists = Array.isArray(allSubjects) && allSubjects.some(s => s.name && s.name.trim().toLowerCase() === subject.name.toLowerCase());
                if (exists)
                {
                    console.error(`Intento de crear materia duplicada (cliente): ${subject.name}`);
                    showDuplicateModal();
                    return; // evitar crear
                }

                await subjectsAPI.create(subject);
            }
            
            form.reset();
            document.getElementById('subjectId').value = '';
            loadSubjects();
        }
        catch (err)
        {
            console.error(err.message);
        }
  });
}

function setupDuplicateModalHandlers()
{
    const modal = document.getElementById('duplicateModal');
    const closeBtn = document.getElementById('closeDuplicate');
    const okBtn = document.getElementById('duplicateOkBtn');

    if (closeBtn) closeBtn.addEventListener('click', hideDuplicateModal);
    if (okBtn) okBtn.addEventListener('click', () => {
        hideDuplicateModal();
        // limpiar campo para que el usuario ingrese otra materia
        const nameInput = document.getElementById('name');
        if (nameInput) nameInput.value = '';
        nameInput.focus();
    });

    // cerrar al clickear fuera del contenido
    if (modal) modal.addEventListener('click', (e) => {
        if (e.target === modal) hideDuplicateModal();
    });
}

function showDuplicateModal()
{
    const modal = document.getElementById('duplicateModal');
    if (modal) modal.style.display = 'block';
}

function hideDuplicateModal()
{
    const modal = document.getElementById('duplicateModal');
    if (modal) modal.style.display = 'none';
}

// 2.1
function setupPaginationControlsSubject() {
    document.getElementById('prevPage').addEventListener('click', () => 
    {
        if (currentPage > 1) 
        {
            currentPage--;
            loadSubjects();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => 
    {
        if (currentPage < totalPages) 
        {
            currentPage++;
            loadSubjects();
        }
    });

    document.getElementById('resultsPerPage').addEventListener('change', e => 
    {
        currentPage = 1;
        loadSubjects();
    });
}

function setupCancelHandler()
{
    const cancelBtn = document.getElementById('cancelBtn');
    cancelBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = '';
    });
}

async function loadSubjects()
{
    try
    {
        // 2.1
        const resPerPage = parseInt(document.getElementById('resultsPerPage').value, 10) || limit;
        const data = await subjectsAPI.fetchPaginated(currentPage, resPerPage);
        console.log(data);
        renderSubjectTable(data.subjects);
        totalPages = Math.ceil(data.total / resPerPage);
        document.getElementById('pageInfo').textContent = `Página ${currentPage} de ${totalPages}`;
    }
    catch (err)
    {
        console.error('Error cargando materias:', err.message);
    }
}

function renderSubjectTable(subjects)
{
    const tbody = document.getElementById('subjectTableBody');
    tbody.replaceChildren();

    subjects.forEach(subject =>
    {
        const tr = document.createElement('tr');

        tr.appendChild(createCell(subject.name));
        tr.appendChild(createSubjectActionsCell(subject));

        tbody.appendChild(tr);
    });
}

function createCell(text)
{
    const td = document.createElement('td');
    td.textContent = text;
    return td;
}

function createSubjectActionsCell(subject)
{
    const td = document.createElement('td');

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Editar';
    editBtn.className = 'w3-button w3-blue w3-small';
    editBtn.addEventListener('click', () => 
    {
        document.getElementById('subjectId').value = subject.id;
        document.getElementById('name').value = subject.name;
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'Borrar';
    deleteBtn.className = 'w3-button w3-red w3-small w3-margin-left';
    deleteBtn.addEventListener('click', () => confirmDeleteSubject(subject.id));

    td.appendChild(editBtn);
    td.appendChild(deleteBtn);
    return td;
}

async function confirmDeleteSubject(id)
{
    if (!confirm('¿Seguro que deseas borrar esta materia?')) return;

    try
    {
        await subjectsAPI.remove(id);
        loadSubjects();
    }
    catch (err)
    {
        console.error('Error al borrar materia:', err.message);
    }
}
