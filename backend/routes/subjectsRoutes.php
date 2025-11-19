<?php
/**
*    File        : backend/routes/subjectsRoutes.php
*    Project     : CRUD PHP
*    Author      : Tecnologías Informáticas B - Facultad de Ingeniería - UNMdP
*    License     : http://www.gnu.org/licenses/gpl.txt  GNU GPL 3.0
*    Date        : Mayo 2025
*    Status      : Prototype
*    Iteration   : 1.0 ( prototype )
*/

require_once("./config/databaseConfig.php");
require_once("./routes/routesFactory.php");
require_once("./controllers/subjectsController.php");



// Si se solicita la versión v43, usamos un handler de DELETE específico
if (isset($_GET['v43']) && $_GET['v43'] == '1') {
	// Mapear solo el método DELETE a la implementación v43
	$customHandlers = [
		'DELETE' => 'handleDelete_v43'
	];
	routeRequest($conn, $customHandlers);
} else {
	routeRequest($conn);
}