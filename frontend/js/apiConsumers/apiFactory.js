/**
*    File        : frontend/js/api/apiFactory.js
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 2.0 ( prototype )
*/

export function createAPI(moduleName, config = {}) 
{
    const API_URL = config.urlOverride ?? `../../backend/server.php?module=${moduleName}`;

    async function sendJSON(method, data) 
    {
        const res = await fetch(API_URL,
        {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        return res;
    }

    return {
        async fetchAll()
        {
            const res = await fetch(API_URL);
            if (!res.ok) throw new Error("No se pudieron obtener los datos");
            return await res.json();
        },
        //2.0
        async fetchPaginated(page = 1, limit = 10)
        {
            const url = `${API_URL}&page=${page}&limit=${limit}`;
            const res = await fetch(url);
            if (!res.ok)
                throw new Error("Error al obtener datos paginados");
            return await res.json();
        },
        async create(data)
        {
            const res = await sendJSON('POST', data);
            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.error || `Error en CREATE: Status ${res.status}`);
            }
            return await res.json();
        },
        async update(data)
        {
            const res = await sendJSON('PUT', data);
            if (!res.ok) {
                const errorBody = await res.json();
                throw new Error(errorBody.error || `Error en UPDATE: Status ${res.status}`);
            }
            return await res.json();
        },
        async remove(id)
        {
            return await sendJSON('DELETE', { id });
        }
    };
}