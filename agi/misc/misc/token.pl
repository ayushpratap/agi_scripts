#!/usr/bin/perl
#
# GET A NEW AWS TOKEN FOR AVS
# $ sudo perl -MCPAN -e 'install JSON'
# $ sudo apt-get install libjson-pp-perl

use JSON qw( decode_json );

# Send POST Request
my $debug = 0;
my $tokenfile = "/tmp/token.avs";
my $request   = "/tmp/token.req";
my $response  = "/tmp/token.resp";
my $url       = "https://api.amazon.com/auth/o2/token";

my $post = "grant_type=refresh_token&refresh_token=Atzr|IwEBIGjZF2uYfs8GGJkmzKMm8AOj5ncYgPegfrylJwtdBYsEA3kYJJ2yU2yg-FqaPstS5A6co8JZqOG11x-78VE-SnQe411qJWfkJDImCYMY-voWiPMDuO82VHojTHmsiY7PP9zJ0w5z-qtxoBsJazB_avc2eiNROSeEQ6kteQ001vZZI3tSoFdbaZWTl0ymg0ALDZiiuXLS0wlyXXSHjZNzZsfKYw3gEFjxobVhUJsAJQiOFndjljLlc4pbZY7SEle6l9H9rXQX8FaTquBbYqH1y58wCBVpz30ouT1Yu_95NrniUuLSmPO0t0cjVGnNqhaD3NIzxLOJD6DYZ9F6iOCBUAOuJ4DI390Ka3yqZchi67_g3jMgGh2VZ2gcPxqYLBEfMrzn3dsRlHHjEqT40A9-KvkSwrRvdBMe8cEjZysaCZALVoFRwF5xgolxk7dXgGzYs-JjMnEtarTGn6FgL9JWROcXoIMPyN3VWdmRQJWswktNbi9oaGE4UH0cfbQXANITUCFkavazfDXt_t31iGCOQFSU&client_id=amzn1.application-oa2-client.c899b6675aaa44b59d650b9f5b793a4b&client_secret=69180e19aa89b0ee655177639ff9ca47e7155d2c1a0b69ce74c29cd358d47ad8" ;

if ($debug) { $verbose = "-v"; }
else { $verbose = ""; }

print ("\nSending HTTP TOKEN REQ to AVS.\n") if ($debug);
my $cmd = qq|/usr/bin/curl -L $verbose -o $response -d "$post" $url\n|;

# just to see request
open($fh, ">", "$request") or die "Can't write file $request: $!";
print $fh "$cmd";
close($fh);

# SEND
$status = `$cmd`;

# READ RESULTS
open(RESULTS, "$response");
$json = do { local $/; <RESULTS> };
close(RESULTS);

# JSON PARSING HERE
$decoded = decode_json($json);
$token = $decoded ->{'access_token'};

# Write out token
open($fh, ">", "$tokenfile") or die "Can't write file $tokenfile: $!";
print $fh "$token";
close($fh);
print ("Token:".$token) if ($debug);

