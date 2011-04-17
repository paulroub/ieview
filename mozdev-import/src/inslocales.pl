#!/usr/bin/perl

use strict;
use warnings;
use utf8;

use open ':std';
use open ':utf8';

my @locales = ();
my %ldescs = ();
my %lcontribs = (

		"ca-AD" => ["Toni Barrera Arboix", "Toni Hermoso Pulido"],
		"cs-CZ" => ["Pavel Penaz"],
		"da-DK" => ["Kim Ludvigsen", "AlleyKat"],
		"de-DE" => ["Andreas Boettcher", "Bart", "Team erweiterungen.de"],
		"el-GR" => ["Sonickydon"],
		"es-AR" => ["acushnir"],
		"es-ES" => ["J.I. Plaza", "micmic"],
		"eu-ES" => ["3ARRANO.com"],
		"fi-FI" => ["Jarno Kiuttu", "yoneh"],
		"fr-FR" => ["BatBat", "Thomas Bertels"],
		"fy-NL" => ["moZes"],
		"he-IL" => ["Rotem Liss"],
		"hu-HU" => ["Andrew Kota"],
		"it-IT" => ["Giovanni Francesco SOLONE"],
		"it-IT" => ["Giuliano Masseroni"],
		"ja-JP" => ["Norah Models"],
		"km-KH" => ["Phireak"],
		"ko-KR" => ["Chankyu Park", "sushizang", "Young-Cheon Kim"],
		"nb-NO" => ["Ghandi2"],
		"nl-NL" => ["Gert-Paul van der Beek"],
		"pl-PL" => ["Bartosz Piec", "Leszek(teo)Życzkowski"],
		"pt-BR" => ["Eduardo Rapoport", "Silvio Santos", "raryelcsouza"],
		"pt-PT" => ["Eduardo Rapaport", "Joao Santos"],
		"ru-RU" => ["lcraFTl"],
		"sk-SK" => ["Wladow"],
		"sl-SI" => ["miles"],
		"sr-YU" => ["Ljubisa Radovanovic"],
		"sv-SE" => ["Thomas Nilsson"],
		"tr-TR" => ["Aycan Demirel", "Fulya Koksal"],
		"zh-CN" => ["Duriel", "WangKing"],
		"zh-TW" => ["Willy Young"],
    "vi-VN" => ["NGUYỄN Mạnh Hùng"],
	);
	
my %lfull = (
	"eu-ES" => "Basque",   	
	"bg-BG" => "Bulgarian", 	
	"ca-AD" => "Catalan", 	
	"zh-CN" => "Chinese (Simplified)", 	
	"zh-TW" => "Chinese (Traditional)",
	"hr-HR" => "Croatian",
	"cs-CZ" => "Czech",
	"da-DK" => "Danish",
	"nl-NL" => "Dutch",
	"en-US" => "English",
	"fi-FI" => "Finnish",
	"fr-FR" => "French",
	"fy-NL" => "Frisian",
	"de-DE" => "German",
	"de-AT" => "German (Austria)",
	"el-GR" => "Greek",
	"he-IL" => "Hebrew",
	"hu-HU" => "Hungarian",
	"it-IT" => "Italian",
	"ja-JP" => "Japanese",
	"km-KH" => "Khmer (Cambodian)",
	"ko-KR" => "Korean",
	"lt-LT" => "Lithuanian",
	"nb-NO" => "Norwegian",
	"pl-PL" => "Polish",
	"pt-BR" => "Portuguese (Brazilian)",
	"pt-PT" => "Portuguese (Portugal)",
	"ru-RU" => "Russian",
	"sr-YU" => "Serbian",
	"sk-SK" => "Slovak",
	"sl-SI" => "Slovenian",
	"es-AR" => "Spanish (Argentina)",
	"es-ES" => "Spanish (Spain)",
	"sv-SE" => "Swedish",
	"th-TH" => "Thai (Thailand)",
	"tr-TR" => "Turkish",
	"uk-UA" => "Ukrainian",
    "vi-VN" => "Vietnamese"
 	        );

my $inf = shift @ARGV;
my $ver = shift @ARGV;

for my $loc (@ARGV)
{
    push @locales, "         <em:locale>locale/$loc/ieview/</em:locale>";

    my $fn = "locale/$loc/ieview/ieview.properties";

    open PROPS, "<$fn" or die "unable to open $fn";

    while (<PROPS>)
      {
	if (/^\s*extensions\.\{6e84150a-d526-41f1-a480-a67d3fed910d\}\.description\s*=\s*(.+?)\s*$/)
	  {
	    my $desc = $1;

	    $ldescs{$loc} = $desc;
	  }

      }

    close PROPS;
}


open INF, "<$inf" or die "unable to open $inf";

while (<INF>)
{
    if (/__LOCALES__/)
    {
	print join("\n", @locales);
    }
    elsif (/__LOCCONTRIBS__/)
    {
    	for my $loc (sort keys %lcontribs)
    	{
    		my $full = $lfull{$loc};
    		
    		die "unknown locale: $loc\n" if ! defined ($full);
    		
 	 		for my $trans (@{$lcontribs{$loc}})
		  		{
		    		print "\t<em:contributor>$trans ($full translation)</em:contributor>\n";
		  		}
    	}
    }
    elsif (/__LOCALDESCS__/)
      {
		for my $loc (sort keys %ldescs)
		  {
		    my $desc = $ldescs{$loc};

		    my $translators = "";

		    if (defined $lcontribs{$loc})
			  	{
			  		my $full = $lfull{$loc};
  		
			  		for my $trans (@{$lcontribs{$loc}})
  					{
						$translators .= "        <em:translator>$trans</em:translator>\n";
  					}
  				}
		    
		    print <<EODESC;
    <em:localized>
      <Description>
        <em:locale>$loc</em:locale>
        <em:name>IE View</em:name>
        <em:description>$desc</em:description>
        <em:creator>Paul Roub</em:creator>
	    <em:homepageURL>http://ieview.mozdev.org/</em:homepageURL>
$translators
      </Description>
    </em:localized>
EODESC
		  }
      }
    else
    {
    	s/__FULLVERSION__/$ver/g;
	print;
    }
}

close INF;

