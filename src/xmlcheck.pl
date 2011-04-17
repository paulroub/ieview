#!/usr/bin/perl

# simple XML well-formedness check; watching for typos that cause XUL to lose it
#

use strict;
use warnings;
use XML::Parser;

my $errs = 0;

foreach my $fn (@ARGV)
  {
    if (! -f $fn)
      {
	print "* $fn - Can't find file.\n";
	next;
      }

    my $parser = new XML::Parser();

    eval {     $parser->parsefile($fn); };

    if ($@)
      {
	my $msg = "* $fn - " . $@;

	$msg =~ s/[\r\n]//g;

	print "$msg\n";

	$errs = 1;
      }
    else
      {
	print "  $fn - OK\n";
      }
  }

exit($errs);
