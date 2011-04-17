#!/usr/bin/perl

# really, really, really brain-dead parsing of RDF files to gen the manifest
#
# this is what happens when I'm in a hurry and don't have the XML modules I need handy
#

use strict;

my ($inf, @locales) = @ARGV;

open INF, "<$inf" or die "unable to open $inf";

while (<INF>) 
{
    print;
}

close INF;

print "\n";


foreach my $loc (@locales)
{
    print "locale\tieview\t$loc\tjar:chrome/ieview.jar!/locale/$loc/ieview/\n\n";
}

