#!/usr/bin/perl -w
#
# absolutely brain-dead check for correctness of IE view locales
# really just making sure that there's a directory, appropriate
# files, a Makefile entry, and install.rdf entry for any locale
# we find; and that all files define the same strings.  All sorts
# of syntax errors will fly by unharmed.
#
use strict;

my $installer = 'install.rdf';

my %locales = ();
my %values = ();

my $errors = 0;

my $checkTranslated = (@ARGV == 1) && ($ARGV[0] eq '-trans');

open INF, "<$installer" or die "unable to open $installer";

while (<INF>)
{
    if (m!\<em\:locale\>locale/(.*)/ieview/\</em:locale\>!)
    {
	my $loc = $1;
	my $locinfo = fetchLocale($loc);

	$locinfo->{'INSTALLRDF'} = 1;
	$locales{$loc} = $locinfo;
    }
}

close INF;

open INF, "<Makefile" or die "unable to open Makefile";

while (<INF>)
{
    
    if (m!^\s*LOCALES\s*\:\=\s*(.+?)\s*$!)
    {
	my @locs = split(/\s+/, $1);

	foreach my $loc (@locs)
	{
	    my $locinfo = fetchLocale($loc);
	    $locinfo->{'MAKEFILE'} = 1;
	    $locales{$loc} = $locinfo;
	}
    }
}

close INF;

opendir DIR, "locale" or die "unable to read dir locale";

my @dirlocales = grep { /^[a-z]+(\-[A-Z]+)?$/ } readdir(DIR);

closedir DIR;

foreach my $dl (@dirlocales)
{
    my $locinfo = fetchLocale($dl);

    $locinfo->{'DIRFOUND'} = 1;

    $locales{$dl} = $locinfo;
}

foreach my $loc ( sort keys %locales )
{
    my $li = $locales{$loc};

    if (! $li->{'DIRFOUND'})
    {
	print "No directory found for $loc\n";
	++$errors;
    }
    else
    {
	foreach my $fn  ('contents.rdf', 'ieview.properties', 'ieview.dtd')
	{
	    my $full = "locale/$loc/ieview/$fn";
	    
	    if (! -f $full)
	    {
		print "$full does not exist\n";
		++$errors;
	    }
	    else
	    {
#		print "-- $full\n";
		open INF, "<$full" or die "unable to read $full";

		while (<INF>)
		{
		    chomp;

		    if (/\<\!ENTITY\s+(.*?)\s+\"(.*)\"\s*\/?\>/)
		    {
			addValue($loc, $1, $2);
		    }
		    elsif (/^(ieview\..+?)\s*\=\s*(.+?)\s*$/)
		    {
			addValue($loc, $1, $2);
		    }
		}

		close INF;
	    }
	}
    }

    if (! $li->{'INSTALLRDF'})
    {
	print "No install.rdf entry found for $loc\n";
	++$errors;
    }

    if (! $li->{'MAKEFILE'})
    {
	print "No Makefile entry found for $loc\n";
	++$errors;
    }
}


my $usLi = $locales{'en-US'};

foreach my $loc ( sort keys %locales )
{
    my $li = $locales{$loc};

    foreach my $vari (sort keys %values)
    {
	if (! defined($li->{'VALUES'}->{$vari}))
	{
	    print "locale $loc does not define $vari\n";
	    ++$errors;
	}
	elsif ($checkTranslated && ($loc ne 'en-US'))
	{
	    if ($li->{'VALUES'}->{$vari} eq $usLi->{'VALUES'}->{$vari})
	    {
		print "locale $loc has untranslated $vari: " . $li->{'VALUES'}->{$vari} . "\n";
		++$errors;
	    }
	}
    }
}

if (! $errors)
{
    print "-- locale check: OK --\n";
}

exit($errors);


sub fetchLocale
{
    my ($locname) = @_;

    if (! defined( $locales{$locname} ))
    {
	my $newlocale = {};

	$newlocale->{'NAME'} = $locname;
	$newlocale->{'INSTALLRDF'} = 0;
	$newlocale->{'DIRFOUND'} = 0;
	$newlocale->{'VALUES'} = {};
	$newlocale->{'MAKEFILE'} = 0;

	$locales{$locname} = $newlocale;
    }

    return( $locales{$locname} );
}


sub addValue
{
    my ($loc, $vari, $value) = @_;

    $values{$vari} = 1;

    $locales{$loc}->{'VALUES'}->{$vari} = $value;
}
