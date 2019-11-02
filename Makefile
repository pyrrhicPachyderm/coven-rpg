SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
RM := rm -f

books := core big-book-of-familiars
book_texs := $(shell echo $(books) | sed "s|[^ ]*|&/&.tex|g")
book_pdfs := $(shell echo $(books) | sed "s|[^ ]*|&.pdf|g")

common_files := common/config.tex common/commands.tex common/edition-notice.tex

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

%.pdf: $$*/$$*.tex $$(wildcard $$*/*.tex) $(common_files)
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $@)" $<
	@ #Outdir is relative to cd directory
