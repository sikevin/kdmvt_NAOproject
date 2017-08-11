import events from '../events';
import $ from 'jquery';
import birdTemplate from './birdTemplate';
import difference from 'lodash.difference';


export default function main() {
    console.log('hello Im main');
    var template = Handlebars.compile(birdTemplate);
    // print(template({'birds': [{'name':'aaaaaa'}, {'name': 'bbbbbbbb'}]}))

    var inputFormObj = inputForm();
    var speMod = speciesModel();
    var speView = speciesView(template);

    events.on('inputChangeEvent', speMod.updateSuggestionsArray);
    events.on('speciesUpdatedEvent', inputFormObj.updateCurrentSuggestions);
    events.on('speciesUpdatedEvent', speView.renderSpecies);
}

// suggestions façon google (un seul block)
function speciesModel() {
    var allSpecies = hydrateSpecies();
    var allPatternMatchingSpecies = [];
    function uppdateSuggestionsArray(currentString) {
        allPatternMatchingSpecies = [];
        var regexString = '^' + currentString ;
        var regex = new RegExp(regexString, 'i');
        for (var i = 0; i < allSpecies.length; i++) {
            if (regex.test(allSpecies[i])) {
                allPatternMatchingSpecies.push(allSpecies[i]);
            }
        }
        events.emit('speciesUpdatedEvent', allPatternMatchingSpecies);
    }
    // makes ajax query and hydrate allSpeciesArray
    function hydrateSpecies() {
        //TODO: ajax query
        //fixte
        return getAllSpeciesFixture();
    }
    return {
        allCurrentSuggestionsArray: allPatternMatchingSpecies,
        updateSuggestionsArray: uppdateSuggestionsArray
    }
}


function speciesView(template) {
    const birdTemplate = template;
    const $resultRow = $('#result-row');
    // to be hydrated just before speciesModel.allPatternMatchingSpecies is updated;
    // then the difference is made between prev state et new state for optimization reasons for rendering AND DO NOT FORGET TO REMOVE
    // diff PREV - NEW => remove

    let allPatternMatchingSpeciesPrev = [];

    function renderSpecies(speciesToRender) {
        $resultRow.empty();
        function birdObject(birdName) {
            this.name = birdName;
        }
        let birdObjectsArray = [];
        for (let i = 0; i < speciesToRender.length; i++) {
            let bird = new birdObject(speciesToRender[i]);
            birdObjectsArray.push(bird);
        }
        let html = birdTemplate({'birds': birdObjectsArray});
        print(html)
        $resultRow.append(html);
    }
    return {
        renderSpecies: renderSpecies
    }
}


function inputForm() {
    var currentSuggestionsArray = [];
    var $input = $('#search-input');
    var $suggestionsContainer = $('#suggestions-container');
    var currentlyHighlighted = -1;

    //dom events binding
    $input.on('input', function(e){
        currentlyHighlighted = -1;
        var currentValue = $(e.target).val();
        events.emit('inputChangeEvent', currentValue);
    });
    $input.on('focusout', function() {
        $suggestionsContainer.empty();
        currentlyHighlighted = [];
    });
    $(document).on('keydown', function(e) {
        print('keydown')
        var keyPressed = String.fromCharCode(e.keyCode);
        var suggestionsLength =  currentSuggestionsArray.length;

        if (suggestionsLength !== 0) {
            // UP
            if (keyPressed == '&') {
                if (currentlyHighlighted !== 0) {
                    currentlyHighlighted = currentlyHighlighted - 1;
                }
                highlightSuggestion(suggestionsLength)
                print(currentlyHighlighted)
            }
            // DOWN
            if (keyPressed == '(') {
                if (currentlyHighlighted < suggestionsLength - 1) {
                    currentlyHighlighted++;
                }
                highlightSuggestion(suggestionsLength)
                print(currentlyHighlighted)
            }
        } else {
        }
    });

    function updateCurrentSuggestions(allPatternMAtchingSpecies) {
        currentSuggestionsArray = allPatternMAtchingSpecies.slice(0,4);
        print('suggestions updated')
        renderSuggestions(currentSuggestionsArray);
    }

    // view functions
    function renderSuggestions(currentSuggestionsArray) {
        $suggestionsContainer.empty();
        for (var i = 0; i < currentSuggestionsArray.length; i++) {
            var rawSuggestion = currentSuggestionsArray[i];
            var suggestion = '<li class="suggestion">' + rawSuggestion + '</li>';
            $(suggestion).appendTo($input)
            // print(suggestion)
            $suggestionsContainer.append(suggestion);
        }
    }
    function highlightSuggestion() {
        // if (index !== -1) {// new highlight
        //     var $liToHighlight = $suggestionsContainer.find('li').eq(index);
        //     $liToHighlight.css('background-color', 'blue');
        // }
        if (currentlyHighlighted !== -1) {
            var $liToHighlight = $suggestionsContainer.find('li').eq(currentlyHighlighted).addClass('selected');
            $liToHighlight.next().removeClass('selected');
            $liToHighlight.prev().removeClass('selected');
        }
    }

    return {
        inputElement: $input,
        updateCurrentSuggestions: updateCurrentSuggestions
    }
}






function getAllSpeciesFixture() {
    var species = [
        'Accipiter gentilis arrigonii (Kleinschmidt, 1903)',
        'Accipiter gentilis (Linnaeus, 1758)',
        'Accipiter nisus (Linnaeus, 1758)',
        'Acrocephalus agricola (Jerdon, 1845)',
        'Acrocephalus arundinaceus (Linnaeus, 1758)',
        'Acrocephalus melanopogon (Temminck, 1823)',
        'Acrocephalus paludicola (Vieillot, 1817)',
        'Acrocephalus palustris (Bechstein, 1798)',
        'Acrocephalus schoenobaenus (Linnaeus, 1758)',
        'Acrocephalus scirpaceus (Hermann, 1804)',
        'Actitis hypoleucos (Linnaeus, 1758)',
        'Aegithalos caudatus (Linnaeus, 1758)',
        'Aegolius funereus (Linnaeus, 1758)',
        'Aegypius monachus (Linnaeus, 1766)',
        'Aix galericulata (Linnaeus, 1758)',
        'Alauda arvensis Linnaeus, 1758)',
        'Alca torda Linnaeus, 1758',
        'Alcedo atthis (Linnaeus, 1758)',
        'Alectoris graeca (Meisner, 1804)',
        'Alectoris rufa (Linnaeus, 1758)',
        'Alle alle (Linnaeus, 1758)',
        'Anas acuta Linnaeus, 1758',
        'Anas crecca crecca Linnaeus, 1758',
        'Anas platyrhynchos Linnaeus, 1758',
        'Anas rubripes Brewster, 1902',
        'Anser albifrons (Scopoli, 1769)',
        'Anser anser anser (Linnaeus, 1758)',
        'Anthus campestris (Linnaeus, 1758)',
        'Anthus petrosus littoralis Brehm, 1823',
        'Anthus petrosus petrosus (Montagu, 1798)',
        'Anthus petrosus (Montagu, 1798)',
        'Anthus pratensis (Linnaeus, 1758)',
        'Anthus richardi Vieillot, 1818',
        'Anthus spinoletta (Linnaeus, 1758)',
        'Anthus trivialis (Linnaeus, 1758)',
        'Apus apus (Linnaeus, 1758)',
        'Apus pallidus (Shelley, 1870)',
        'Aquila chrysaetos (Linnaeus, 1758)',
        'Aquila fasciata Vieillot, 1822',
        'Ardea cinerea Linnaeus, 1758',
        'Ardea purpurea Linnaeus, 1766',
        'Ardenna gravis (O\'Reilly, 1818)',
        'Ardeola ralloides (Scopoli, 1769)',
        'Arenaria interpres (Linnaeus, 1758)',
        'Asio flammeus (Pontoppidan, 1763)',
        'Asio otus (Linnaeus, 1758)',
        'Athene noctua (Scopoli, 1769)',
        'Aythya ferina (Linnaeus, 1758)',
        'Aythya nyroca (GÃ¼ldenstÃ¤dt, 1770)',
        'Bombycilla garrulus (Linnaeus, 1758)',
        'Bonasa bonasia (Linnaeus, 1758)',
        'Botaurus stellaris (Linnaeus, 1758)',
        'Branta bernicla bernicla (Linnaeus, 1758)',
        'Branta bernicla (Linnaeus, 1758)',
        'Bubo bubo (Linnaeus, 1758)',
        'Bubo scandiaca (Linnaeus, 1758)',
        'Bucephala clangula (Linnaeus, 1758)',
        'Burhinus oedicnemus (Linnaeus, 1758)',
        'Buteo buteo (Linnaeus, 1758)',
        'Buteo lagopus (Pontoppidan, 1763)',
        'Calandrella brachydactyla (Leisler, 1814)',
        'Calandrella rufescens (Vieillot, 1820)',
        'Calcarius lapponicus (Linnaeus, 1758)',
        'Calidris alba (Pallas, 1764)',
        'Calidris alpina alpina (Linnaeus, 1758)',
        'Calidris alpina schinzii (Brehm, 1822)',
        'Calidris alpina (Linnaeus, 1758)',
        'Calidris canutus (Linnaeus, 1758)',
        'Calidris falcinellus (Pontoppidan, 1763)',
        'Calidris ferruginea (Pontoppidan, 1763)',
        'Calidris maritima (BrÃ¼nnich, 1764)',
        'Calidris melanotos (Vieillot, 1819)',
        'Calidris minuta (Leisler, 1812)',
        'Calidris minutilla (Vieillot, 1819)',
        'Calidris pugnax (Linnaeus, 1758)',
        'Calidris pusilla (Linnaeus, 1758)',
        'Calidris subruficollis (Vieillot, 1819)',
        'Calidris temminckii (Leisler, 1812)',
        'Calonectris diomedea (Scopoli, 1769)',
        'Caprimulgus europaeus Linnaeus, 1758',
        'Caprimulgus ruficollis Temminck, 1820',
        'Carduelis cannabina (Linnaeus, 1758)',
        'Carduelis carduelis (Linnaeus, 1758)',
        'Carduelis chloris (Linnaeus, 1758)',
        'Carduelis citrinella (Pallas, 1764)',
        'Carduelis corsicana (Koenig, 1899)',
        'Carduelis flammea cabaret (MÃ¼ller, 1776)',
        'Carduelis flammea flammea (Linnaeus, 1758)',
        'Carduelis flavirostris (Linnaeus, 1758)',
        'Carduelis hornemanni (Holboell, 1843)',
        'Carduelis spinus (Linnaeus, 1758)',
        'Cepphus grylle (Linnaeus, 1758)',
        'Certhia brachydactyla C.L. Brehm, 1820',
        'Certhia familiaris Linnaeus, 1758',
        'Cettia cetti (Temminck, 1820)',
        'Charadrius alexandrinus Linnaeus, 1758',
        'Charadrius dubius Scopoli, 1786',
        'Charadrius hiaticula Linnaeus, 1758',
        'Chlidonias hybrida (Pallas, 1811)',
        'Chlidonias leucopterus (Temminck, 1815)',
        'Chlidonias niger (Linnaeus, 1758)',
        'Chroicocephalus ridibundus (Linnaeus, 1766)',
        'Ciconia ciconia (Linnaeus, 1758)',
        'Ciconia nigra (Linnaeus, 1758)',
        'Cinclus cinclus (Linnaeus, 1758)',
        'Circaetus gallicus (Gmelin, 1788)',
        'Circus aeruginosus (Linnaeus, 1758)',
        'Circus cyaneus (Linnaeus, 1758)',
        'Circus macrourus (S. G. Gmelin, 1771)',
        'Circus pygargus (Linnaeus, 1758)',
        'Cisticola juncidis (Rafinesque, 1810)',
        'Clamator glandarius (Linnaeus, 1758)',
        'Clanga pomarina (C. L. Brehm, 1831)',
        'Clangula hyemalis (Linnaeus, 1758)',
        'Coccothraustes coccothraustes (Linnaeus, 1758)',
        'Coccyzus erythropthalmus (Wilson, 1811)',
        'Colinus virginianus (Linnaeus, 1758)',
        'Columba livia Gmelin, 1789',
        'Columba oenas Linnaeus, 1758',
        'Columba palumbus Linnaeus, 1758',
        'Coracias garrulus Linnaeus, 1758',
        'Corvus corax Linnaeus, 1758',
        'Corvus corone cornix Linnaeus, 1758',
        'Corvus corone corone Linnaeus, 1758',
        'Corvus frugilegus Linnaeus, 1758',
        'Corvus monedula spermologus (Vieillot, 1821)',
        'Corvus monedula Linnaeus, 1758',
        'Coturnix coturnix (Linnaeus, 1758)',
        'Crex crex (Linnaeus, 1758)',
        'Cuculus canorus Linnaeus, 1758',
        'Delichon urbicum (Linnaeus, 1758)',
        'Dendrocopos major (Linnaeus, 1758)',
        'Dendrocopos medius (Linnaeus, 1758)',
        'Dendrocopos minor (Linnaeus, 1758)',
        'Dryocopus martius (Linnaeus, 1758)',
        'Egretta garzetta (Linnaeus, 1766)',
        'Emberiza bruniceps Brandt, 1841',
        'Emberiza calandra Linnaeus, 1758',
        'Emberiza cia Linnaeus, 1766',
        'Emberiza cirlus Linnaeus, 1758',
        'Emberiza citrinella Linnaeus, 1758',
        'Emberiza hortulana Linnaeus, 1758',
        'Emberiza pusilla Pallas, 1776',
        'Emberiza schoeniclus schoeniclus (Linnaeus, 1758)',
        'Emberiza schoeniclus (Linnaeus, 1758)',
        'Eremophila alpestris (Linnaeus, 1758)',
        'Erithacus rubecula (Linnaeus, 1758)',
        'Eudromias morinellus (Linnaeus, 1758)',
        'Falco columbarius Linnaeus, 1758',
        'Falco eleonorae GÃ©nÃ©, 1839',
        'Falco naumanni Fleischer, 1818',
        'Falco peregrinus Tunstall, 1771',
        'Falco subbuteo Linnaeus, 1758',
        'Falco tinnunculus Linnaeus, 1758',
        'Falco vespertinus Linnaeus, 1766',
        'Ficedula albicollis (Temminck, 1815)',
        'Ficedula hypoleuca (Pallas, 1764)',
        'Ficedula parva (Bechstein, 1794)',
        'Fratercula arctica (Linnaeus, 1758)',
        'Fringilla coelebs Linnaeus, 1758',
        'Fringilla montifringilla Linnaeus, 1758',
        'Fulica atra Linnaeus, 1758',
        'Fulmarus glacialis (Linnaeus, 1761)',
        'Galerida cristata (Linnaeus, 1758)',
        'Galerida theklae (C. L. Brehm, 1858)',
        'Gallinago gallinago (Linnaeus, 1758)',
        'Gallinago media (Latham, 1787)',
        'Gallinula chloropus (Linnaeus, 1758)',
        'Garrulus glandarius (Linnaeus, 1758)',
        'Gavia adamsii (Gray, 1859)',
        'Gavia arctica (Linnaeus, 1758)',
        'Gavia immer (BrÃ¼nnich, 1764)',
        'Gavia stellata (Pontoppidan, 1763)',
        'Gelochelidon nilotica (Gmelin, 1789)',
        'Glareola pratincola (Linnaeus, 1766)',
        'Grus grus (Linnaeus, 1758)',
        'Gypaetus barbatus (Linnaeus, 1758)',
        'Gyps fulvus (Hablizl, 1783)',
        'Haematopus ostralegus Linnaeus, 1758',
        'Haliaeetus albicilla (Linnaeus, 1758)',
        'Hieraaetus pennatus (Gmelin, 1788)',
        'Himantopus himantopus (Linnaeus, 1758)',
        'Hippolais icterina (Vieillot, 1817)',
        'Hippolais polyglotta (Vieillot, 1817)',
        'Hirundo rustica Linnaeus, 1758',
        'Hydrobates castro (Harcourt, 1851)',
        'Hydrobates leucorhous (Vieillot, 1818)',
        'Hydrobates pelagicus (Linnaeus, 1758)',
        'Hydrocoloeus minutus (Pallas, 1776)',
        'Ichthyaetus audouinii (Payraudeau, 1826)',
        'Ichthyaetus melanocephalus (Temminck, 1820)',
        'Jynx torquilla Linnaeus, 1758',
        'Lagopus muta helvetica (Thienemann, 1829)',
        'Lanius collurio Linnaeus, 1758',
        'Lanius excubitor Linnaeus, 1758',
        'Lanius meridionalis Temminck, 1820',
        'Lanius minor Gmelin, 1788',
        'Lanius senator badius Hartlaub, 1854',
        'Lanius senator senator Linnaeus, 1758',
        'Lanius senator Linnaeus, 1758',
        'Larus argentatus Pontoppidan, 1763',
        'Larus canus Linnaeus, 1758',
        'Larus fuscus fuscus Linnaeus, 1758',
        'Larus fuscus graellsii Brehm, 1857',
        'Larus fuscus Linnaeus, 1758',
        'Larus glaucoides Meyer, 1822',
        'Larus hyperboreus Gunnerus, 1767',
        'Larus marinus Linnaeus, 1758',
        'Larus michahellis Naumann, 1840',
        'Limosa lapponica (Linnaeus, 1758)',
        'Limosa limosa islandica Brehm, 1831',
        'Limosa limosa limosa (Linnaeus, 1758)',
        'Limosa limosa (Linnaeus, 1758)',
        'Locustella fluviatilis (Wolf, 1810)',
        'Locustella luscinioides (Savi, 1824)',
        'Locustella naevia (Boddaert, 1783)',
        'Lophophanes cristatus (Linnaeus, 1758)',
        'Loxia curvirostra Linnaeus, 1758',
        'Loxia pytyopsittacus Borkhausen, 1793',
        'Lullula arborea (Linnaeus, 1758)',
        'Luscinia luscinia (Linnaeus, 1758)',
        'Luscinia megarhynchos C. L. Brehm, 1831',
        'Luscinia svecica cyanecula (Wolf, 1810)',
        'Luscinia svecica namnetum Mayaud, 1934',
        'Luscinia svecica svecica (Linnaeus, 1758)',
        'Luscinia svecica (Linnaeus, 1758)',
        'Lymnocryptes minimus (BrÃ¼nnich, 1764)',
        'Lyrurus tetrix (Linnaeus, 1758)',
        'Mareca penelope (Linnaeus, 1758)',
        'Mareca strepera (Linnaeus, 1758)',
        'Melanitta fusca (Linnaeus, 1758)',
        'Melanitta nigra (Linnaeus, 1758)',
        'Melanocorypha calandra (Linnaeus, 1766)',
        'Mergellus albellus (Linnaeus, 1758)',
        'Mergus merganser Linnaeus, 1758',
        'Mergus serrator Linnaeus, 1758',
        'Merops apiaster Linnaeus, 1758',
        'Milvus migrans (Boddaert, 1783)',
        'Milvus milvus (Linnaeus, 1758)',
        'Monticola saxatilis (Linnaeus, 1758)',
        'Monticola solitarius (Linnaeus, 1758)',
        'Montifringilla nivalis (Linnaeus, 1766)',
        'Morus bassanus (Linnaeus, 1758)',
        'Motacilla alba alba Linnaeus, 1758',
        'Motacilla alba yarrellii Gould, 1837',
        'Motacilla alba Linnaeus, 1758',
        'Motacilla cinerea Tunstall, 1771',
        'Motacilla flava cinereocapilla Savi, 1831',
        'Motacilla flava flava Linnaeus, 1758',
        'Motacilla flava flavissima (Blyth, 1834)',
        'Motacilla flava iberiae Hartert, 1921',
        'Motacilla flava Linnaeus, 1758',
        'Muscicapa striata (Pallas, 1764)',
        'Neophron percnopterus (Linnaeus, 1758)',
        'Netta rufina (Pallas, 1773)',
        'Nucifraga caryocatactes caryocatactes (Linnaeus, 1758)',
        'Nucifraga caryocatactes macrorhynchus Brehm, 1823',
        'Nucifraga caryocatactes (Linnaeus, 1758)',
        'Numenius arquata (Linnaeus, 1758)',
        'Numenius tenuirostris Vieillot, 1817',
        'Nycticorax nycticorax (Linnaeus, 1758)',
        'Oenanthe hispanica (Linnaeus, 1758)',
        'Oenanthe isabellina (Temminck, 1829)',
        'Oenanthe oenanthe leucorhoa (Gmelin, 1789)',
        'Oenanthe oenanthe oenanthe (Linnaeus, 1758)',
        'Oenanthe oenanthe (Linnaeus, 1758)',
        'Oriolus oriolus (Linnaeus, 1758)',
        'Otus scops (Linnaeus, 1758)',
        'Pandion haliaetus (Linnaeus, 1758)',
        'Panurus biarmicus (Linnaeus, 1758)',
        'Parkesia noveboracensis (Gmelin, 1789)',
        'Parus major Linnaeus, 1758',
        'Parus montanus montanus Conrad von Baldenstein, 1827',
        'Parus montanus rhenanus Kleinschmidt, 1910',
        'Passer domesticus domesticus (Linnaeus, 1758)',
        'Passer italiae (Vieillot, 1817)',
        'Passer montanus (Linnaeus, 1758)',
        'Perdix perdix perdix (Linnaeus, 1758)',
        'Perdix perdix (Linnaeus, 1758)',
        'Periparus ater (Linnaeus, 1758)',
        'Pernis apivorus (Linnaeus, 1758)',
        'Petronia petronia (Linnaeus, 1766)',
        'Phalacrocorax aristotelis aristotelis (Linnaeus, 1761)',
        'Phalacrocorax aristotelis desmarestii (Payraudeau, 1826)',
        'Phalacrocorax carbo carbo (Linnaeus, 1758)',
        'Phalacrocorax carbo (Linnaeus, 1758)',
        'Phalaropus fulicarius (Linnaeus, 1758)',
        'Phalaropus lobatus (Linnaeus, 1758)',
        'Phasianus colchicus Linnaeus, 1758',
        'Phoenicurus ochruros (S. G. Gmelin, 1774)',
        'Phoenicurus phoenicurus (Linnaeus, 1758)',
        'Phylloscopus bonelli (Vieillot, 1819)',
        'Phylloscopus collybita collyba (Vieillot, 1817)',
        'Phylloscopus collybita (Vieillot, 1887)',
        'Phylloscopus ibericus Ticehurst, 1937',
        'Phylloscopus proregulus (Pallas, 1811)',
        'Phylloscopus sibilatrix (Bechstein, 1793)',
        'Phylloscopus trochilus acredula (Linnaeus, 1758)',
        'Phylloscopus trochilus trochilus (Linnaeus, 1758)',
        'Pica pica (Linnaeus, 1758)',
        'Picus canus Gmelin, 1788',
        'Picus viridis sharpei (H. Saunders, 1872)',
        'Picus viridis viridis Linnaeus, 1758',
        'Picus viridis Linnaeus, 1758',
        'Platalea leucorodia Linnaeus, 1758',
        'Plectrophenax nivalis (Linnaeus, 1758)',
        'Plegadis falcinellus (Linnaeus, 1766)',
        'Pluvialis apricaria altifrons (Brehm, 1831)',
        'Pluvialis apricaria (Linnaeus, 1758)',
        'Pluvialis squatarola (Linnaeus, 1758)',
        'Podiceps auritus (Linnaeus, 1758)',
        'Podiceps cristatus (Linnaeus, 1758)',
        'Podiceps grisegena (Boddaert, 1783)',
        'Podiceps nigricollis Brehm, 1831',
        'Poecile palustris (Linnaeus, 1758)',
        'Porphyrio alleni Thomson, 1842',
        'Porzana porzana (Linnaeus, 1766)',
        'Prunella collaris (Scopoli, 1769)',
        'Prunella modularis (Linnaeus, 1758)',
        'Pterocles alchata (Linnaeus, 1758)',
        'Ptyonoprogne rupestris (Scopoli, 1769)',
        'Puffinus griseus (Gmelin, 1789)',
        'Puffinus mauretanicus Lowe, 1921',
        'Puffinus puffinus (BrÃ¼nnich, 1764)',
        'Puffinus yelkouan (Acerbi, 1827)',
        'Pyrrhocorax graculus (Linnaeus, 1766)',
        'Pyrrhocorax pyrrhocorax (Linnaeus, 1758)',
        'Pyrrhula pyrrhula europaea Vieillot, 1816',
        'Pyrrhula pyrrhula pyrrhula (Linnaeus, 1758)',
        'Pyrrhula pyrrhula (Linnaeus, 1758)',
        'Rallus aquaticus Linnaeus, 1758',
        'Recurvirostra avosetta Linnaeus, 1758',
        'Regulus ignicapilla (Temminck, 1820)',
        'Regulus regulus (Linnaeus, 1758)',
        'Remiz pendulinus (Linnaeus, 1758)',
        'Riparia riparia (Linnaeus, 1758)',
        'Rissa tridactyla (Linnaeus, 1758)',
        'Saxicola rubetra (Linnaeus, 1758)',
        'Saxicola rubicola (Linnaeus, 1766)',
        'Scolopax rusticola Linnaeus, 1758',
        'Serinus serinus (Linnaeus, 1766)',
        'Setophaga ruticilla (Linnaeus, 1758)',
        'Sitta europaea Linnaeus, 1758',
        'Sitta whiteheadi Sharpe, 1884',
        'Somateria mollissima (Linnaeul, 1758)',
        'Spatula clypeata (Linnaeus, 1758)',
        'Spatula discors (Linnaeus, 1766)',
        'Spatula querquedula (Linnaeus, 1758)',
        'Stercorarius longicaudus Vieillot, 1819',
        'Stercorarius parasiticus (Linnaeus, 1758)',
        'Stercorarius pomarinus (Temminck, 1815)',
        'Stercorarius skua (BrÃ¼nnich, 1764)',
        'Sterna dougallii Montagu, 1813',
        'Sterna hirundo Linnaeus, 1758',
        'Sterna paradisaea Pontoppidan, 1763',
        'Sternula albifrons (Pallas, 1764)',
        'Streptopelia decaocto (Frivaldszky, 1838)',
        'Streptopelia roseogrisea (Sundevall, 1857)',
        'Streptopelia turtur (Linnaeus, 1758)',
        'Strix aluco Linnaeus, 1758',
        'Sturnus roseus (Linnaeus, 1758)',
        'Sturnus unicolor Temminck, 1820',
        'Sturnus vulgaris Linnaeus, 1758',
        'Sylvia atricapilla (Linnaeus, 1758)',
        'Sylvia borin (Boddaert, 1783)',
        'Sylvia cantillans (Pallas, 1764)',
        'Sylvia communis Latham, 1787',
        'Sylvia conspicillata Temminck, 1820',
        'Sylvia curruca (Linnaeus, 1758)',
        'Sylvia hortensis (Gmelin, 1789)',
        'Sylvia melanocephala (Gmelin, 1789)',
        'Sylvia sarda Temminck, 1820',
        'Sylvia undata undata (Boddaert, 1783)',
        'Sylvia undata (Boddaert, 1783)',
        'Syrmaticus reevesii (J. E. Gray, 1829)',
        'Syrrhaptes paradoxus (Pallas, 1773)',
        'Tachymarptis melba (Linnaeus, 1758)',
        'Tadorna tadorna (Linnaeus, 1758)',
        'Tetrao urogallus aquitanicus Ingram, 1915',
        'Tetrao urogallus Linnaeus, 1758',
        'Tetrax tetrax (Linnaeus, 1758)',
        'Thalasseus sandvicensis (Latham, 1787)',
        'Tichodroma muraria (Linnaeus, 1758)',
        'Tringa erythropus (Pallas, 1764)',
        'Tringa glareola Linnaeus, 1758',
        'Tringa nebularia (Gunnerus, 1767)',
        'Tringa ochropus Linnaeus, 1758',
        'Tringa solitaria Wilson, 1813',
        'Tringa stagnatilis (Bechstein, 1803)',
        'Tringa totanus totanus (Linnaeus, 1758)',
        'Tringa totanus (Linnaeus, 1758)',
        'Troglodytes troglodytes (Linnaeus, 1758)',
        'Turdus eunomus Temminck, 1831',
        'Turdus iliacus Linnaeus, 1766',
        'Turdus merula Linnaeus, 1758',
        'Turdus philomelos C. L. Brehm, 1831',
        'Turdus pilaris Linnaeus, 1758',
        'Turdus torquatus alpestris (Brehm, 1831)',
        'Turdus torquatus torquatus Linnaeus, 1758',
        'Turdus torquatus Linnaeus, 1758',
        'Turdus viscivorus Linnaeus, 1758',
        'Tyto alba (Scopoli, 1769)',
        'Upupa epops Linnaeus, 1758',
        'Uria aalge (Pontoppidan, 1763)',
        'Uria lomvia (Linnaeus, 1758)',
        'Vanellus vanellus (Linnaeus, 1758)',
        'Xema sabini (Sabine, 1819)',
        'Xenus cinereus (GÃ¼ldenstÃ¤dt, 1775)',
        'Zapornia pusilla (Pallas, 1776)',
        'Zoothera aurea (Holandre, 1825)'];

    return species;
}

function print(string) {
    console.log(string)
}