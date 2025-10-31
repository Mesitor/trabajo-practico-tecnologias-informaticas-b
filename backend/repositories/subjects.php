<?php
/**
*    File        : backend/models/subjects.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

function getAllSubjects($conn) 
{
    $sql = "SELECT * FROM subjects";

    return $conn->query($sql)->fetch_all(MYSQLI_ASSOC);
}

// 2.1
function getPaginatedSubjects($conn, $limit, $offset) {
    $stmt = $conn->prepare("SELECT * FROM subjects LIMIT ? OFFSET ?");
    $stmt->bind_param("ii", $limit, $offset);
    $stmt->execute();
    $result = $stmt->get_result();
    return $result->fetch_all(MYSQLI_ASSOC);
}

function getTotalSubjects($conn) 
{
    $sql = "SELECT COUNT(*) AS total FROM subjects";
    $result = $conn->query($sql);
    return $result->fetch_assoc()['total'];
}


function getSubjectById($conn, $id) 
{
    $sql = "SELECT * FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();
    $result = $stmt->get_result();

    return $result->fetch_assoc(); 
}

function createSubject($conn, $name) 
{
    $sql = "INSERT INTO subjects (name) VALUES (?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $name);
    $stmt->execute();

    return 
    [
        'inserted' => $stmt->affected_rows,        
        'id' => $conn->insert_id
    ];
}

/**
 * Verifica si existe una materia con el mismo nombre.
 * Retorna true si existe, false en caso contrario.
 */
function subjectExistsByName($conn, $name)
{
    $sql = "SELECT COUNT(*) AS cnt FROM subjects WHERE LOWER(name) = LOWER(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $name);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    return intval($res['cnt']) > 0;
}

/**
 * Verifica si existe una materia con el mismo nombre
 * excluyendo un id determinado (útil al actualizar para no contar el propio registro).
 */
function subjectExistsByNameExcludingId($conn, $name, $excludeId)
{
    $sql = "SELECT COUNT(*) AS cnt FROM subjects WHERE LOWER(name) = LOWER(?) AND id <> ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $name, $excludeId);
    $stmt->execute();
    $res = $stmt->get_result()->fetch_assoc();
    return intval($res['cnt']) > 0;
}

function updateSubject($conn, $id, $name) 
{
    $sql = "UPDATE subjects SET name = ? WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("si", $name, $id);
    $stmt->execute();

    return ['updated' => $stmt->affected_rows];
}

function deleteSubject($conn, $id) 
{
    $sql = "DELETE FROM subjects WHERE id = ?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("i", $id);
    $stmt->execute();

    return ['deleted' => $stmt->affected_rows];
}
?>
