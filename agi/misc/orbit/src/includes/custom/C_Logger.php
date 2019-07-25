<?php
/**
 * @author Ayush Pratap Singh (ayushs56@gmail.com)
 */
namespace Orbit\Includes\Custom\C_Logger;
require_once __DIR__.'../../vendor/autoload.php';

use Monolog\Logger;
use Monolog\Handler\StreamHandler;

class C_Logger
{
	/**
		 * Returns a monolog logger instaces
		 * @param string $fileName 
		 * @param string $loggerName 
		 * @return object
		 */	
	function __construct(string $fileName, string $loggerName)
	{
		return $this->getLogger($fileName, $loggerName);
	}

	/**
	 * getLogger : This functions creates a monolog logger instance.
	 * @param string $fileName 
	 * @param string $loggerName 
	 * @return object
	 */
	private function getLogger(string $fileName,string $loggerName)
	{
		$path = __DIR__.'../../logs/'.$fileName.'.log';
		$logger = new Logger($loggerName);
		$logger->pushHandler(new StreamHandler($path, Logger::WARNING));
		return $logger;
	}
}
?>