use strict;

if (@ARGV != 1)
{
    die "usage: checkversion.pl expectedVersion\n";
}

my $expectVersion = $ARGV[0];

# Makefile:
#  MAJOR_VERSION\s*=\s*([\.\d]+)
#  MINOR_VERSION\s*=\s*([\.\d]+)

# install.rdf
# <em:version>(.*)</em

# install.js.in
# APP_VERSION

# content/contents.rdf
# displayName="IE View (.*)"

my $errors = 0;

my ($makefileMajor, $makefileMinor) = (scanVersion('Makefile', "MAJOR_VERSION\\s*=\\s*([\\.\\d]+)"), 
				       scanVersion('Makefile', "MINOR_VERSION\\s*=\\s*([\\.\\d]+)"));

my $instrdfVersion = scanVersion('install.rdf',  "\\<em:version\\>(.*)\\<");

my $jsVersion = scanVersion('install.js', "APP_VERSION.*\"(.*)\"");

my $contrdfVersion = scanVersion('content/contents.rdf', "displayName\\s*=\\s*\"IE View (.*)\"");

my $latestversion = scanVersion('../downloads/latest-version.txt', "^(.+)");

print "  Expected version: $expectVersion\n";
confirmVersion('Makefile',      "$makefileMajor\.$makefileMinor");
confirmVersion('install.rdf',   $instrdfVersion);
confirmVersion('install.js', $jsVersion);
confirmVersion('contents.rdf',  $contrdfVersion);
confirmVersion('latest-version.txt', $latestversion);

if (! $errors)
{
    print "-- Version check: OK --\n";
}

exit($errors);

sub scanVersion
{
    my ($fn, $pattern) = @_;
    my $result = "NOT FOUND";

    open(INF, "<$fn") or die "unable to open $fn";

    while (<INF>)
    {
	if (/$pattern/)
	{
	    $result = $1;
	    last;
	}
    }

    close INF;
    return($result);
}


sub confirmVersion
{
    my ($fn, $gotVersion) = @_;

    if ($gotVersion eq $expectVersion)
    {
	print "  ";
    }
    else
    {
	print "* ";
	++$errors;
    }

    print "$fn: $gotVersion\n";
}

