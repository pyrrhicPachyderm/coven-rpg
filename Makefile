SHELL := /bin/bash
LATEXMK_FLAGS = --pdf --cd
RM := rm -f

images_dir := imgs

aspell_personal_dict := ./.aspell.en.personal

volumes := core big-book-of-familiars creatures-of-the-night summons-and-blood-magic herbiary
books := omnibus $(volumes)
book_pdfs := $(shell echo $(books) | sed -E "s|[^ ]+|&.pdf|g")

common_files := $(wildcard common/*.tex)

core_deps := #Core has no dependencies
big_book_of_familiars_deps := core
creatures_of_the_night_deps := core
summons_and_blood_magic_deps := core
herbiary_deps := core
omnibus_deps := $(volumes)

all: $(book_pdfs)

clean:
	@(\
		shopt -s globstar;\
		$(RM) **/*.aux **/*.log **/*.out **/*.toc **/*.fls;\
		$(RM) **/*.fdb_latexmk;\
		$(RM) **/*.bbl **/*.run.xml **/*.auxlock;\
		$(RM) **/*.idx **/*.ind **/*.ilg;\
		$(RM) **/*.dep **/*.dpth **/*.md5 **/*-figure*.pdf;\
		\
		$(RM) **/*.png;\
	)
Clean: clean
	@(\
		shopt -s globstar;\
		$(RM) **/*.pdf **/*.dvi;\
	)
spellcheck:
	@for file in $$(find -name "*.tex" -not -path "./common/*"); do \
		aspell check \
		--lang=en_GB --personal=$(aspell_personal_dict) \
		--dont-backup \
		--mode=tex --tex-check-comments \
		--add-tex-command='zexternaldocument opo' \
		--add-tex-command='simpletable pP' \
		--add-tex-command='notedtable pPP' \
		--add-tex-command='partlabel p' \
		--add-tex-command='partref p' \
		--add-tex-command='feat oPpPPP' \
		--add-tex-command='featref p' \
		$$file;\
	done
featcount:
	@(\
		shopt -s globstar;\
		grep -cF "\feat{" **/*.tex | grep -v :0;\
	)
dropcap:
	@for book in $(books); do \
		for file in $$(find "$$book" -name "*.tex" | grep -vF "/$$book.tex" | grep -vF "/chapter-list.tex"); do \
			if ! grep -q "\dropcap" "$$file" ; then \
				echo "$$file does not contain \dropcap" ;\
			fi \
		done \
	done

.PHONY: all clean Clean spellcheck featcount dropcap

#.SECONDARY with no prerequisites means that intermediate files are not deleted on completion.
.SECONDARY:


########
#Images.
########

%.png: %.tif
	convert $< $@

###############
#Website stuff.
###############

website_dir := website
website_pdfs := $(shell echo $(book_pdfs) | sed -E "s|[^ ]+|$(website_dir)/&|g")

$(website_dir)/%.pdf: %.pdf
	@cp $< $@

website: $(website_pdfs)

.PHONY: website


######################
#The books themselves.
######################

#First, define a bunch of prerequisites for the books.
#Use = instead of := to ensure they are recursively expanded.
#That is, they are expanded in the context of the make rule where they are used, not now, where they are defined.

#The .tex for the main file for the book.
prereq_main_tex = $$*/$$*.tex
#All the other .tex files in the same folder.
prereq_extra_tex = $$(wildcard $$*/*.tex)
#All the image files for the book.
prereq_images = $$(addsuffix .png,$$(basename $$(wildcard $$*/imgs/*)))
#The folder names for the books this book depends on, to be used in defining subsequent prerequisites.
#NB: This one should not be used as a prerequisite itself.
prereq_dependency = $$($$(shell echo $$* | sed "s|-|_|g")_deps)
#All the .tex files in the books this book depends on.
prereq_dependency_tex = $$(wildcard $$(shell echo $(prereq_dependency) | sed -E "s|[^ ]+|&/*.tex|g"))
#The .pdf files of the books this depends on, to make sure those are compiled first.
prereq_dependency_pdf = $$(shell echo $(prereq_dependency) | sed -E "s|[^ ]+|&.pdf|g")
#All the image files for the books this depends on.
prereq_dependency_images = $$(addsuffix .png,$$(basename $$(wildcard $$(shell echo $(prereq_dependency) | sed -E "s|[^ ]+|&/$(images_dir)/*|g"))))

.SECONDEXPANSION:

%.pdf: $(prereq_main_tex) $(prereq_extra_tex) $(prereq_images) $(common_files) $(prereq_dependency_tex) $(prereq_dependency_pdf) $(prereq_dependency_images)
	latexmk $(LATEXMK_FLAGS) --jobname="$(basename $@)" $<
	mv "$*/$@" "$@"
#prereq_dependency_pdf should ensure that all books this book depends on are compiled first.
#This should ensure that the external references exist and work properly.
#However, it will probably break if the book that's depended upon is compiled, then the aux files removed.
#I might need to ensure make is aware of the aux files in order to fix this.
#The simplest way would be to depend on the aux file for every tex file.
#Rules for the aux files would just invoke latexmk on the main file in their directory.
#However, not every tex file has a corresponding aux file (e.g. chapter-list.tex).
