#/usr/bin/perl

use strict;
use warnings;

use utf8;

use open ':std';
use open ':utf8';

my @rows = ();

if (@ARGV != 2)
{
    die "usage: creditgen.pl rdfname htmlname\n";
}

my ($rdfname, $htmlname) = @ARGV;

open INF, "<$rdfname" or die "unable to open $rdfname";

while (<INF>)
{
    if (/\<em\:contributor\>\s*(.+?)\s+\((.+)\)\</)
    {
	my ($job, $contrib) = ($2, $1);

	push @rows, "<tr><th>" . debracket($contrib) . ":</th><td>" . debracket($job) . "</td></tr>";
    }
}


close INF;

open INF, "<$htmlname" or die "unable to open $htmlname";

my  $inlist = 0;

while (<INF>)
{
    if ($inlist)
    {
	if (/end credits/i)
	{
	    $inlist = 0;
	    print $_;
	}
    }
    else
    {
	print $_;

	if (/\<!--.*begin credits/i)
	{
	    $inlist = 1;
	    print join("\n", sort {lc($a) cmp lc($b)} @rows) . "\n";
	}
    }
}



sub debracket
{
    my ($result) = @_;

    $result =~ s/\</\&lt\;/g;
    $result =~ s/\>/\&gt\;/g;

    return($result);
}
