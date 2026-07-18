package com.accenture.WebAppVoli.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.accenture.WebAppVoli.dto.VoloDto;
import com.accenture.WebAppVoli.model.Volo;
import com.accenture.WebAppVoli.repository.VoloRepository;

@Service
public class VoloService {

    @Autowired
    private VoloRepository voloRepository;

    public Volo save(VoloDto voloDto){
        //questo metodo converte il dto nell'entità che andrà salvata nel db(metodo scritto alla fine)
        Volo volo = dtoToEntity(voloDto);

        return voloRepository.save(volo);
    }

    private Volo dtoToEntity(VoloDto voloDto){
        Volo volo = new Volo();

        volo.setCompagnia(voloDto.getCompagnia());
        volo.setAeroportoPartenza(voloDto.getAeroportoPartenza());
        volo.setAeroportoDestinazione(voloDto.getAeroportoDestinazione());
        volo.setData(voloDto.getData());
        volo.setOrarioDecollo(voloDto.getOrarioDecollo());
        volo.setOrarioAtterraggio(voloDto.getOrarioAtterraggio());
        volo.setPostiDisponibili(voloDto.getPostiDisponibili());

        return volo;
    }

    public Volo update(Integer codice, VoloDto voloDto){
        Volo voloDaAggiornare = voloRepository.findById(codice).get();

        voloDaAggiornare.setAeroportoPartenza(voloDto.getAeroportoPartenza());
        voloDaAggiornare.setAeroportoDestinazione(voloDto.getAeroportoDestinazione());
        voloDaAggiornare.setCompagnia(voloDto.getCompagnia());
        voloDaAggiornare.setData(voloDto.getData());
        voloDaAggiornare.setOrarioDecollo(voloDto.getOrarioDecollo());
        voloDaAggiornare.setOrarioAtterraggio(voloDto.getOrarioAtterraggio());
        voloDaAggiornare.setPostiDisponibili(voloDto.getPostiDisponibili());

        return voloRepository.save(voloDaAggiornare);
    }

    public void delete(Integer codice){
        voloRepository.deleteById(codice);
    }

    public Volo getById(Integer codice){
        return voloRepository.findById(codice).get();
    }

    public List<Volo> getAll(){
        return voloRepository.findAll();
    }

    // per la ricerca in base hai parametri sottostanti (aggiunti anche al VoloRepository)
    public List<Volo> ricerca(String aeroportoPartenza,
                            String aeroportoDestinazione,
                            LocalDate data,
                            String compagnia){

        if(aeroportoPartenza != null){
            return voloRepository.findByAeroportoPartenza(aeroportoPartenza);
        }

        if(aeroportoDestinazione != null){
            return voloRepository.findByAeroportoDestinazione(aeroportoDestinazione);
        }

        if(data != null){
            return voloRepository.findByData(data);
        }

        if(compagnia != null){
            return voloRepository.findByCompagnia(compagnia);
        }

        return voloRepository.findAll();
    }
}
