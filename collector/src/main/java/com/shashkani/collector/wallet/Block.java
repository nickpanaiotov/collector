package com.shashkani.collector.wallet;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.redis.core.RedisHash;

import java.util.Set;

@Data
@RedisHash("Block")
public class Block {

    @Id
    private int id;
    private int count;

    @Transient
    private Set<Wallet> wallets;
}
