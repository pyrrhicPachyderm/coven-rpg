SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
maindoc := coven
RM := rm -f

chapters := introduction character-creation-guide attributes-and-skills familiars tools-of-the-craft
chapter_files := $(shell echo $(chapters) | sed "s/[^ ]*/&.tex/g")

all: $(maindoc).pdf

$(maindoc).pdf: $(maindoc).tex $(chapter_files)
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $@)" $<
pvc: $(maindoc).pdf
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $<)" $< --pvc
clean:
	@latexmk $(LATEXMK_FLAGS) -c -silent
	@(\
		shopt -s globstar;\
		$(RM) **/*.bbl **/*.run.xml **/*.auxlock;\
		$(RM) **/*.dep **/*.dpth **/*.log **/*.md5 **/*-figure*.pdf;\
	)
Clean: clean
	@$(RM) $(maindoc).pdf

.PHONY: all pvc clean Clean
