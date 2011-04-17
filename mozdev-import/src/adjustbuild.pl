use strict;

use File::Copy;

my $noAdjust = (@ARGV == 1) && ($ARGV[0] eq '-noadjust');

my ($origMajor, $origMinor, $origFull) = ('', '', '');

open INF, "<Makefile" or die "unable to open Makefile";

while (<INF>)
{
    if (/^MAJOR_VERSION\s+=\s+([0-9\.]+)/)
    {
	$origMajor = $1;
    }
    elsif (/^MINOR_VERSION\s+=\s+([0-9\.]+)/)
    {
	$origMinor = $1;
    }

}

close INF;

if ($origMajor eq '')
{
    die "no MAJOR_VERSION found in Makefile\n";
}

if ($origMinor eq '')
{
    die "no MINOR_VERSION found in Makefile\n";
}

$origFull = "$origMajor.$origMinor";

print "original: $origFull\n";

my @parts = split(/\./, $origFull);

while (@parts < 4)
{
    push @parts, 0;
}

print join('.', @parts) . "\n";

my ($maj, $minor, $rev, $build) = @parts;

my ($sec,$min,$hour,$mday,$mon,$year,$wday,$yday,$isdst) = localtime(time);

$year = ($year % 100);
$mon++;

$build  = sprintf("%02i%02i%02i%02i%02i", $year, $mon, $mday, $hour, $min);

my $newMinor = "$minor.$rev.$build";

my $newFull = "$origMajor.$newMinor";

if ($noAdjust)
{
    $newFull = $origFull;
    $newMinor = $origMinor;
}

print "new build: $newFull\n";

replacer('Makefile', "MAJOR_VERSION\\s+=\\s+[0-9]+", "MAJOR_VERSION = $origMajor");
replacer('Makefile', "MINOR_VERSION\\s+=\\s+[0-9\\.]+", "MINOR_VERSION = $newMinor");
# replacer('install.rdf.in', "<em:version>[0-9\\.]+</em:version>", "<em:version>$newFull</em:version>");
replacer('content/contents.rdf', "chrome:displayName=\"IE View [0-9\\.]+\"", "chrome:displayName=\"IE View $newFull\"");
replacer('../downloads/latest-version.txt', "^[0-9\\.]+", $newFull);


sub replacer
{
    my ($fn, $pat, $replacement) = @_;
    my $tmpfn = "$fn.tmp";

    print "replacing $pat in $fn with $replacement\n";

    open INF, "<$fn" or die "unable to open $fn for reading\n";
    open OUTF, ">$tmpfn" or die "unable to create $tmpfn\n";

    while (<INF>)
    {
	s/$pat/$replacement/;

	print OUTF;
    }

    close INF;
    close OUTF;

    move($tmpfn, $fn) or die "unable to move $tmpfn to $fn";
}
