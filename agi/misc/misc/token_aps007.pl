#!/usr/bin/perl
#
# GET A NEW AWS TOKEN FOR AVS
# $ sudo perl -MCPAN -e 'install JSON'
# $ sudo apt-get install libjson-pp-perl

use JSON qw( decode_json );

# Send POST Request
my $debug = 0;
my $tokenfile = "/tmp/token_aps007.avs";
my $request   = "/tmp/token_aps007.req";
my $response  = "/tmp/token_aps007.resp";
my $url       = "https://api.amazon.com/auth/o2/token";

my $post = "grant_type=refresh_token&refresh_token=Atzr|IwEBIIu4mPbupTCaAoCDgA_R6my4kDB-muLwRef6q5yADlR9-jdGvJsLhHFIuLCnJJpQioQ-Lf1QE421YbVxrnJk6Ry7V3Hji4zD6ru-CXuve0-yfGPKImwh-BwruKXvylbw6CMeZJWqOB5N4SyQWerbUcZh6D1sI93HnkW7-hM9gg_94jFu14UkhRv4FD7zNGivw5GuBlAVitSm7VGNZDsmwRy2zMzQyyOR9aMQKWfjwWn6sTUDdK5gfzkNAekOJ8R5nER5OcB0ZvrOkOrHWDGmX3pTAjtzZ3R1vc8qUQ_5DdLpw2SWrl6ak8a7kOjUFhE2NiBvPYX3bmcP85QGkjplRFH5KiA5z6EGg_OKbGfZKJC555TTwgW0HtUmyZ8p_fmDPw00N5Ai1hrwv8tQwLtoJ6lQPjaLMK3L39MGtTZPJY67w6JI0FrBPNxA6lDs2N-MgWZd8BTUep2DXBbuXbUC1TKc-1hLdVItiwDCWlYJW6eUjE2b3rR2ehOU8HUK1JYRFvLMiYLM7AzfeQXOVTeY2iz8uatrE49mQZMPLOwQuHMvuQ&client_id=amzn1.application-oa2-client.c899b6675aaa44b59d650b9f5b793a4b&client_secret=69180e19aa89b0ee655177639ff9ca47e7155d2c1a0b69ce74c29cd358d47ad8" ;

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
