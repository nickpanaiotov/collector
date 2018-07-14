package com.shashkani.collector.wallet;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigInteger;
import java.util.Optional;

@CrossOrigin
@RestController
public class WalletController {

    private final WalletRepository walletRepository;
    private final BlockRepository blockRepository;

    @Autowired
    public WalletController(WalletRepository walletRepository, BlockRepository blockRepository) {
        this.walletRepository = walletRepository;
        this.blockRepository = blockRepository;
    }

    @PostMapping("/blocks")
    public ResponseEntity post(@RequestBody Block block) {
        this.blockRepository.save(block);
        this.walletRepository.saveAll(block.getWallets());

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/wallets")
    public ResponseEntity get(Pageable pageable) {
        return ResponseEntity.ok(this.walletRepository.findAll(pageable));
    }

    @GetMapping("/blocks")
    public ResponseEntity getBlocks(Pageable pageable) {
        return ResponseEntity.ok(this.blockRepository.findAll(pageable));
    }

    @GetMapping("/blocks/{id}")
    public ResponseEntity getBlocks(@PathVariable("id") String id) {
        Optional<Block> block = this.blockRepository.findById(id);
        if (block.isPresent()) {
            return ResponseEntity.ok(block);
        }

        return ResponseEntity.notFound().build();
    }
}
