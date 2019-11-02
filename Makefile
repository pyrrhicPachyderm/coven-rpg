SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
RM := rm -f

books := omnibus core big-book-of-familiars
book_pdfs := $(shell echo $(books) | sed -r "s|[^ ]+|&.pdf|g")

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
		$(RM) **/*.dep **/*.dpth **/*.md5 **/*-figure*.pdf;\
	)
Clean: clean
	@(\
		shopt -s globstar;\
		$(RM) **/*.pdf **/*.dvi;\
	)

.PHONY: all clean Clean


.SECONDEXPANSION:

%.pdf: $$*/$$*.tex $$(wildcard $$*/*.tex) $(common_files) $$(wildcard $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -r "s|[^ ]*|&/+.tex|g")) $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -r "s|[^ ]+|&.pdf|g")
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $@)" $<
	@ #Outdir is relative to cd directory
	mv "$*/$@" "$@"

#Add extra dependencies to some books (all the tex files in the books they depend on)
#%.pdf: $$(wildcard $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -r "s|[^ ]*|&/+.tex|g"))

#Add extra dependencies to some books (the PDF files of the books they depend on, to make sure those are compiled first)
#%.pdf: $$(shell echo $$($$(shell echo $$* | sed "s|-|_|g")_deps) | sed -r "s|[^ ]+|&.pdf|g")
