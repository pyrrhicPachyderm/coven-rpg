SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
maindoc := coven
RM := rm -f

chapters := introduction character-creation-guide attributes-and-skills familiars equipment general-rules willing headology broomcraft sympathetic-magic
stories := weather-story flying-story
chapter_files := $(shell echo $(chapters) | sed "s/[^ ]*/&.tex/g")
story_files := $(shell echo $(stories) | sed "s/[^ ]*/&.tex/g")
misc_files := edition-notice.tex

all: $(maindoc).pdf

$(maindoc).pdf: $(maindoc).tex $(chapter_files) $(story_files) $(misc_files)
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
