package com.accenture.WebAppVoli.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.accenture.WebAppVoli.model.Volo;
import java.time.LocalTime;


public interface VoloRepository extends JpaRepository<Volo, Integer>{
    List<Volo> findByAeroportoPartenza(String aeroportoPartenza);

    List<Volo> findByAeroportoDestinazione(String aeroportoDestinazione);

    List<Volo> findByCompagnia(String compagnia);

    List<Volo> findByData(LocalDate data);

    //List<Volo> findByOrarioDecollo(LocalTime orarioDecollo);
}
