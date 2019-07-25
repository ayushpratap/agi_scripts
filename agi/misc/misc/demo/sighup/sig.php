#!/usr/bin/php -q
<?php
pcntl_async_signals(true);
class base
{
    public function __construct()
    {
        pcntl_signal(SIGTERM, [$this, 'signalHandler']);
        pcntl_signal(SIGHUP, [$this, 'signalHandler']);
        pcntl_signal(SIGINT, [$this, 'signalHandler']);
        pcntl_signal(SIGQUIT, [$this, 'signalHandler']);
        pcntl_signal(SIGUSR1, [$this, 'signalHandler']);
        pcntl_signal(SIGUSR2, [$this, 'signalHandler']);
        pcntl_signal(SIGALRM, [$this, 'signalHandler']);
    }
    public function signalHandler($signalNumber)
    {
        switch($signalNumber)
        {
            case SIGTERM:
                echo "Hello - 1\n";
//                exit('SIGTERM');
		$this->killed(100);
            break;

            case SIGQUIT:
                echo "Hello - 2\n";
		$this->killed(100);
		
                //exit('SIGQUIT');
            break;

            case SIGINT:
                echo "Hello - 3\n";
		$this->killed(100);
		
               // exit('SIGINT');
            break;

            case SIGHUP:
                echo "Hello - 4\n";
		$this->killed(100);
//                exit('SIGHUP');
            break;

            case SIGUSR1:
                echo "Hello - 5\n";
		$this->killed(100);
//                exit('SIGUSR1');
            break;

            case SIGUSR2:
                echo "Hello - 6\n";
		$this->killed(100);
//                exit('SIGUSR2');
            break;

            case SIGALRM:
                echo "Hello - 7\n";
		$this->killed(100);
//                exit('SIGALRM');
            break;
        }
    }
    private function display(int $limit)
    {
        $i = 0;
        while(1)
        {
            echo $i,"\n";
            $i++;
            if($i > $limit)
            {
                break;
            }
        }
    }
	private function killed(int $limit)
	{
		echo "----------";
		while($limit>0)
		{
			echo $limit,"\n";
			$limit--;
		}
		echo "++++++++++";
		exit("Bye Bye");
	}	
    public function show(int $limit)
    {
        $this->display($limit);
    }
}

$obj = new base();
$i = 10;
while(1)
{
    $obj->show($i);
    $i++;
}
?>
