SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
RM := rm -f

books := omnibus core big-book-of-familiars
book_pdfs := $(shell echo $(books) | sed -E "s|[^ ]+|&.pdf|g")

common_files := common/config.tex common/commands.tex common/edition-notice.tex

core_deps := #Core has no dependencies
big_book_of_familiars_deps := core
omnibus_deps := $(books)

all: $(book_pdfs)

clean:
	@(\
		shopt -s globstar;\
		$(RM) **/*.aux **/*.log **/*.out **/*.toc **/*.fls;\
		$(RM) **/*.fdb_latexmk;\
		$(RM) **/*.bbl **/*.run.xml **/*.auxlock;\
		$(RM) **/*.idx **/*.ind **/*.ilg;\
		$(RM) **/*.dep **/*.dpth **/*.md5 **/*-figure*.pdf;\
	)
Clean: clean
	@(\
		shopt -s globstar;\
		$(RM) **/*.pdf **/*.dvi;\
	)
cleanbak: #For removing .bak files created by aspell
	@(\
		shopt -s globstar;\
		$(RM) **/*.bak;\
	)

.PHONY: all clean Clean cleanbak



#Website stuff

website_dir := website
website_pdfs := $(shell echo $(book_pdfs) | sed -E "s|[^ ]+|$(website_dir)/&|g")

$(website_dir)/%.pdf: %.pdf
	@cp $< $@

website: $(website_pdfs)

.PHONY: website



#The books themselves

.SECONDEXPANSION:

%.pdf: $$*/$$*.tex $$(wildcard $$*/*.tex) $(common_files) $$(wildcard $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -E "s|[^ ]*|&/+.tex|g")) $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -E "s|[^ ]+|&.pdf|g")
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $@)" $<
	@ #Outdir is relative to cd directory
	mv "$*/$@" "$@"
#The two monstrous prerequisites for this rule are respectively:
# - All the tex files in the books this book depends on.
# - The PDF files of the books this depends on, to make sure those are compiled first.
#This latter one should ensure that the external references exist and work properly.
#However, it will probably break if the book that's depended upon is compiled, then the aux files removed.
#I might need to ensure make is aware of the aux files in order to fix this.
#The simplest way would be to depend on the aux file for every tex file.
#Rules for the aux files would just invoke latexmk on the main file in their directory.
#However, not every tex file has a corresponding aux file (e.g. chapter-list.tex).
